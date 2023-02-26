import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import { create } from 'zustand'
import type { Peer, MediaConnection } from 'peerjs'
import { resolve } from 'path'

type StreamStore = {
  userStream: MediaStream | null
  remoteStreams: Array<{ id: string; stream: MediaStream }>
  loading: boolean
  error: null | string
  getUserStream: () => void
  removeUserStream: () => void
}

type UserStore = {
  userId: string
  setUserId: (userId: string) => void
}

interface ServerToClientEvents {
  'user-connected': (remoteUserId: string) => void
  'user-disconnected': (remoteUserId: string) => void
}
interface ClientToServerEvents {
  'join-room': (myRoomId: string, myUserId: string) => void
}

type SocketPeerStore = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  peer: Peer | null
  // peerMap: Map<string, MediaConnection>
  enterMeeupRoom: (myRoomId: string) => void
  leaveMeeupRoom: () => void
}

type Store = StreamStore & UserStore & SocketPeerStore

export const useStores = create<Store>((set, get) => ({
  userStream: null,
  remoteStreams: [],
  loading: false,
  error: null,
  getUserStream: async () => {
    try {
      set((state) => ({ loading: true }))
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      set((state) => ({ userStream: stream, loading: false }))
    } catch (error) {
      set((state) => ({ error: 'something wrong', loading: false }))
    }
  },
  removeUserStream: () => {
    get()
      .userStream?.getTracks()
      .forEach((track) => track.stop())
    set((state) => ({ userStream: null }))
  },
  userId: '',
  setUserId: (userId: string) => {
    set(() => ({ userId }))
  },
  socket: null,
  peer: null,
  // peerMap: new Map(),
  enterMeeupRoom: async (myRoomId: string) => {
    const res = await Promise.all([createSocketIo(), createPeer()])

    const { socket } = res[0]
    console.log('socket.io 連線成功')

    const { peer, peerId } = res[1]
    console.log('peer 連線成功')

    const { userStream } = get()
    if (!userStream) {
      console.error('no userStream')
      return
    }

    const peerMap: Map<string, MediaConnection> = new Map()

    const handleSocketPeer = (call: MediaConnection) => {
      const videoId = 'video_' + call.connectionId
      call
        .on('stream', (remoteStream: MediaStream) => {
          if (peerMap.has(call.peer)) return
          else {
            console.log('create stream, videoId:', videoId)
            peerMap.set(call.peer, call)
            set((state) => ({
              remoteStreams: [
                ...state.remoteStreams,
                { id: videoId, stream: remoteStream },
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

    // 監聽別人對我的來電
    peer.on('call', (call: MediaConnection) => {
      console.log('[通知] 收到其他用戶來電', { call })

      // 主動回應此來電
      call.answer(userStream)
      handleSocketPeer(call)
    })

    // 當有人加入房間時
    socket.on('user-connected', (remoteUserId: string) => {
      console.log(`[通知] 用戶 ${remoteUserId} 已加入房間`)

      // 主動聯繫別人，並接收對方的來電
      const call = peer.call(remoteUserId, userStream)
      handleSocketPeer(call)
    })

    // 當有人離開房間時
    socket.on('user-disconnected', (remoteUserId: string) => {
      console.log(`[通知] 用戶 ${remoteUserId} 已退出房間`)

      // 如果此用戶存在則關閉來電
      const call = peerMap.get(remoteUserId)
      if (!call) return
      else {
        call.close()
      }
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
}))

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
