import type { CreateStore } from '@/stores'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { Peer, MediaConnection } from 'peerjs'
import { peerHandlers } from './peerHandlers'
import { socketHandlers } from './socketHandlers'

type RemoteStream = {
  id: string
  userId: string
  stream: MediaStream
  video: boolean
  audio: boolean
}

export type PeerMetadata = {
  userId: string
  audio: boolean
  video: boolean
}

interface ServerToClientEvents {
  'user-connected': (remotePeerId: string, metadata: PeerMetadata) => void
  'user-disconnected': (remotePeerId: string) => void
}

interface ClientToServerEvents {
  'join-room': (
    myRoomId: string,
    myPeerId: string,
    metadata: PeerMetadata
  ) => void
}

export type SocketPeerStore = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  peer: Peer | null
  myPeerId: string
  remoteStreams: Array<RemoteStream>
  peerMap: Map<string, MediaConnection>
  enterMeeupRoom: (myRoomId: string) => void
  leaveMeeupRoom: () => void
  setRemoteVideo: (peerId: string, nextState: boolean) => void
  setRemoteAudio: (peerId: string, nextState: boolean) => void
}

export const createSocketPeerStore: CreateStore<SocketPeerStore> = (
  set,
  get
) => ({
  socket: null,
  peer: null,
  myPeerId: '',
  remoteStreams: [],
  peerMap: new Map(),
  enterMeeupRoom: async (myRoomId: string) => {
    const res = await Promise.all([createSocketIo(), createPeer()])

    const { socket } = res[0] as {
      socket: Socket<ServerToClientEvents, ClientToServerEvents>
    }
    console.log('socket.io 連線成功')

    const { peer, peerId: myPeerId } = res[1]
    console.log('peer 連線成功')

    // keep peerId
    set(() => ({ myPeerId }))
    console.log('MyPeerId:', myPeerId)

    /**
     * 1. 連接到Peer服務器時，會獲得隨機的用戶識別，讓用戶之間能夠相互對接。
     *
     * 2. 我們將 Socketio 當作訊息通道，並使用 Peerjs 傳輸視訊流。
     */

    // 監聽別人對我的來電 (當我加入房間，別人主動通知我)
    peer.on('call', (call: MediaConnection) => {
      console.log('[通知] 收到其他用戶來電', { call })

      const { userStream } = get()
      if (!userStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      // 被動回應此來電
      call.answer(userStream)

      // 播放對方視訊
      const { onStream, onClose, onError } = peerHandlers(
        get,
        set,
        call,
        call.metadata
      )
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    })

    const { userConnected, userDisconnected } = socketHandlers(get, set, peer)

    // 當有人加入房間時
    socket.on('user-connected', userConnected)

    // 當有人離開房間時
    socket.on('user-disconnected', userDisconnected)

    // 所有連線設置完成(Socketio 與 Peerjs 皆建立連線)後，加入房間
    socket.emit('join-room', myRoomId, myPeerId, {
      userId: get().userId,
      audio: get().audio,
      video: get().video,
    })

    set(() => ({ socket, peer }))
  },
  leaveMeeupRoom: () => {
    get().socket?.close()
    set(() => ({ socket: null, peer: null }))
  },
  setRemoteVideo: (remotePeerId: string, nextState: boolean) => {},
  setRemoteAudio: (remotePeerId: string, nextState: boolean) => {},
})

/**
 * 向服務端建立 socket 連線。
 */
function createSocketIo(): Promise<{ socket: Socket }> {
  const socket = io('http://localhost:4000')
  return new Promise((resolve) => {
    socket.on('connect', () => resolve({ socket }))
  })
}

/**
 * 直接使用 npx peerjs --port=4001 創建伺服器
 */
async function createPeer(): Promise<{ peer: Peer; peerId: string }> {
  const Peer = (await import('peerjs')).default
  const peer = new Peer('', {
    host: 'localhost',
    port: 4001,
    path: '/peerjs',
  })
  return new Promise((resolve) => {
    peer.on('open', (peerId) => resolve({ peer, peerId }))
  })
}
