import type { CreateStore } from '.'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { Peer, MediaConnection } from 'peerjs'

interface ServerToClientEvents {
  'user-connected': (remoteUserId: string) => void
  'user-disconnected': (remoteUserId: string) => void
  'user-off-stream': (remoteUserId: string) => void
  'user-on-stream': (remoteUserId: string) => void
  'user-mute': (remoteUserId: string) => void
  'user-unmute': (remoteUserId: string) => void
}
interface ClientToServerEvents {
  'join-room': (myRoomId: string, myUserId: string) => void
  'hide-camera': (myRoomId: string, myUserId: string) => void
  'show-camera': (myRoomId: string, myUserId: string) => void
  mute: (myRoomId: string, myUserId: string) => void
  unmute: (myRoomId: string, myUserId: string) => void
}

export type SocketPeerStore = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  peer: Peer | null
  peerId: string
  // peerMap: Map<string, MediaConnection>
  enterMeeupRoom: (myRoomId: string) => void
  leaveMeeupRoom: () => void
}

export const createSocketPeerStore: CreateStore<SocketPeerStore> = (set, get) => ({
  socket: null,
  peer: null,
  peerId: '',
  // peerMap: new Map(),
  enterMeeupRoom: async (myRoomId: string) => {
    const res = await Promise.all([createSocketIo(), createPeer()])

    const { socket } = res[0]
    console.log('socket.io 連線成功')

    const { peer, peerId } = res[1]
    console.log('peer 連線成功')

    // keep peerId
    set(() => ({ peerId }))

    const peerMap: Map<string, MediaConnection> = new Map()

    const handleSocketPeer = (call: MediaConnection) => {
      console.log('handleSocketPeer', call.peer)
      const videoId = call.peer
      call
        .on('stream', (remoteStream: MediaStream) => {
          if (peerMap.has(call.peer)) return
          else {
            console.log('create stream, videoId:', videoId)
            peerMap.set(call.peer, call)
            set((state) => ({
              remoteStreams: [
                ...state.remoteStreams,
                { id: videoId, stream: remoteStream, muted: true },
              ],
            }))
          }
        })
        .on('close', () => {
          console.log('remove stream, videoId:', videoId)
          set((state) => ({
            remoteStreams: state.remoteStreams.filter((s) => s.id !== videoId),
          }))
        })
        .on('error', (error: Error) => {
          console.log('remove stream, videoId:', videoId)
          set((state) => ({
            remoteStreams: state.remoteStreams.filter((s) => s.id !== videoId),
          }))
        })
    }

    /**
     * 1. 連接到Peer服務器時，會獲得隨機的用戶識別，讓用戶之間能夠相互對接。
     *
     * 2. 我們將 Socketio 當作訊息通道，僅使用 Peerjs 傳輸視訊流。
     */

    console.log('PeerId:', peerId.substring(6))

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
      handleSocketPeer(call)
    })

    // 當有人加入房間時
    socket.on('user-connected', (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已加入房間`)

      const { userStream } = get()
      if (!userStream) {
        console.error('[ERROR] userStream is invalid')
        return
      }

      // 主動聯繫別人，並接收對方的來電
      const call = peer.call(remotePeerId, userStream)

      // 播放對方視訊
      handleSocketPeer(call)
    })

    // 當有人離開房間時
    socket.on('user-disconnected', (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 已退出房間`)

      // 如果此用戶存在則關閉來電
      const call = peerMap.get(remotePeerId)
      if (!call) return
      else {
        call.close()
      }
    })

    // 當有人關閉攝影機時
    socket.on('user-off-stream', (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 隱藏攝影機`)

      // 將對方的視訊設置為黑畫面
      const remote = get().remoteStreams.filter((s) => s.id === remotePeerId)[0]
      remote.stream?.getTracks().forEach((track) => track.stop())
    })

    // 當有人開啟攝影機時
    socket.on('user-on-stream', (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 開啟攝影機`)

      // // 主動聯繫別人，並接收對方的來電
      // const call = peer.call(remotePeerId, userStream)

      // // 播放對方視訊
      // handleSocketPeer(call)
      // socket.emit('join-room')
    })

    socket.on('user-mute', (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 關閉聲音`)
    })

    socket.on('user-unmute', (remotePeerId: string) => {
      console.log(`[通知] 用戶 ${remotePeerId} 開啟聲音`)
    })

    // 所有連線設置完成(Socketio 與 Peerjs 皆建立連線)後，加入房間
    socket.emit('join-room', myRoomId, peerId)

    set(() => ({ socket, peer }))
  },
  leaveMeeupRoom: () => {
    const { socket } = get()
    socket?.close()
    set(() => ({ socket: null, peer: null }))
  },
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
    host: '/',
    port: 4001,
  })
  return new Promise((resolve) => {
    peer.on('open', (peerId) => resolve({ peer, peerId }))
  })
}
