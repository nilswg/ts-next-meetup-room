import { create } from 'zustand'
import { io } from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { Peer, MediaConnection } from 'peerjs'
import { socketHandlers } from './socketHandlers'
import { screenHandlers } from './screenHandlers'
import { webcamHandlers } from './webcamHandlers'
import { removeStream, setStreamAudio, setStreamVideo } from '@/lib/stream'

export type PeerMetadata = {
  userId: string
  peerId: string
  audio: boolean
  video: boolean
  streamType: 'webcam' | 'screen' | 'none' // 鏡頭,螢幕,沒有
  single?: boolean
}

type Store = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  peer: Peer | null
  myPeerId: string
  myScreenPeer: Peer | null
  myScreenPeerId: string
  remoteStreams: Array<{
    id: string
    userId: string
    stream: MediaStream
    video: boolean
    audio: boolean
  }>
  screen: ScreenProps
  remoteScreen: ScreenProps
  peerMap: Map<string, MediaConnection>
  peerScreenMap: Map<string, { screenPeerId: string; call: MediaConnection }>
}

type Actions = {
  enterMeeupRoom: (props: EnterRoomProps) => Promise<void>
  leaveMeeupRoom: () => void
  resetWebcam: (props: ResetWebcamProps) => void
  setRemoteVideo: (remotePeerId: string, nextState: boolean) => void
  setRemoteAudio: (remotePeerId: string, nextState: boolean) => void
  screenShare: (props: ShareScreenProps) => void
  stopScreenShare: (props: StopShareScreenProps) => void
  createScreenStream: () => Promise<MediaStream>
  removeScreenStream: () => void
}

export type StoreSet = (f: (state: Store) => Partial<Store>) => void

export type StoreGet = () => Store

export const useSockerPeerStore = create<Store & Actions>((set, get) => ({
  socket: null,
  peer: null,
  myPeerId: '',
  myScreenPeer: null,
  myScreenPeerId: '',
  remoteStreams: [],
  peerMap: new Map(),
  peerScreenMap: new Map(),
  screen: {
    peerId: '',
    userId: '',
    stream: null,
    loading: false,
    error: '',
    video: true,
    audio: false,
    frameRate: 30,
  },
  remoteScreen: {
    peerId: '',
    userId: '',
    stream: null,
    loading: false,
    error: '',
    video: true,
    audio: false,
    frameRate: 30,
  },
  enterMeeupRoom: async (props: EnterRoomProps) => {
    const { myRoomId, myUserId, answerStream, video, audio } = props
    const res = await Promise.all([createSocketIo(), createPeer()])
    const { socket } = res[0]
    const { peer, myPeerId } = res[1]
    set(() => ({ myPeerId }))

    /**
     * 1. 連接到Peer服務器時，會獲得隨機的用戶識別，讓用戶之間能夠相互對接。
     *
     * 2. 我們將 Socketio 當作訊息通道，並使用 Peerjs 傳輸視訊流。
     */

    // 監聽別人對我的來電 (當我加入房間，別人主動通知我)
    peer.on('call', (call: MediaConnection) => {
      console.log('[通知] 收到其他用戶來電', { call })
      const metadata: PeerMetadata = call.metadata

      // 被動回應此來電
      if (answerStream) {
        call.answer(answerStream)
      }

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, call.metadata)
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    })

    const { userConnected, userDisconnected, userShareScreen, userStopShareScreen, userResetWebcam } = socketHandlers(
      get,
      set,
      peer,
      myPeerId,
      myUserId,
      answerStream
    )

    socket.on('user-connected', userConnected)
    socket.on('user-disconnected', userDisconnected)
    socket.on('user-share-screen', userShareScreen)
    socket.on('user-stop-share-screen', userStopShareScreen)
    socket.on('user-reset-webcam', userResetWebcam)

    socket.emit('join-room', myRoomId, myPeerId, {
      streamType: 'webcam',
      peerId: myPeerId,
      userId: myUserId,
      video,
      audio,
    })

    set(() => ({ socket, peer }))
  },
  leaveMeeupRoom: () => {
    get().socket?.close()

    // 清除個人連線參數
    set(() => ({
      socket: null,
      // webcam
      peer: null,
      myPeerId: '',
      // screen
      myScreenPeer: null,
      myScreenPeerId: '',
      screen: {
        peerId: '',
        userId: '',
        stream: null,
        loading: false,
        error: '',
        video: true,
        audio: false,
        frameRate: 30,
      },
    }))

    // 清除他人連線暫存數據
    set(() => ({
      // webcam
      peerMap: new Map(),
      remoteStreams: [],
      // screen
      peerScreenMap: new Map(),
      remoteScreen: {
        peerId: '',
        userId: '',
        stream: null,
        loading: false,
        error: '',
        video: true,
        audio: false,
        frameRate: 30,
      },
    }))
  },
  resetWebcam: async ({ newWebcamStream, myRoomId, myUserId, video, audio }: ResetWebcamProps) => {
    const socket = get().socket!
    const lastPeerId = get().myPeerId!

    // 重置攝影機，需要取得新的 peer 連線。
    const { peer, myPeerId } = await createPeer()

    // 重置他人的遠端視訊
    set(()=>({ remoteStreams:[], peerMap:new Map() }))

    // 監聽別人對我的來電 (當我加入房間，別人主動通知我)
    peer.on('call', (call: MediaConnection) => {
      console.log('[通知] 收到其他用戶來電', { call })
      const metadata: PeerMetadata = call.metadata

      // 被動回應此來電
      if (newWebcamStream) {
        call.answer(newWebcamStream)
      }

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, call.metadata)
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    })

    socket.emit('reset-webcam', myRoomId, myPeerId, {
      streamType: 'webcam',
      userId: myUserId,
      peerId: lastPeerId,
      video,
      audio,
    })

    // 更新 peer, myPeerId
    set(() => ({ peer, myPeerId }))
  },
  setRemoteVideo: (remotePeerId: string, nextState: boolean) => {
    const remote = get().remoteStreams.filter((s) => s.id === remotePeerId)[0]
    if (!remote) {
      alert('remoteStream notfound')
      return
    }
    remote.stream.getVideoTracks().forEach((t) => (t.enabled = nextState))
  },
  setRemoteAudio: (remotePeerId: string, nextState: boolean) => {
    const remote = get().remoteStreams.filter((s) => s.id === remotePeerId)[0]
    if (!remote) {
      alert('remoteStream notfound')
      return
    }
    remote.stream.getAudioTracks().forEach((t) => (t.enabled = nextState))
  },
  screenShare: async (props: ShareScreenProps) => {
    const socket = get().socket!
    const myPeerId = get().myPeerId!
    const { myRoomId, myUserId, answerStream, video, audio } = props

    // 建立新的 Peer 連線，專門用來分享畫面
    const { peer, myPeerId: myScreenPeerId } = await createPeer()
    set(() => ({ myScreenPeer: peer, myScreenPeerId }))

    peer.on('call', (call: MediaConnection) => {
      const metadata: PeerMetadata = call.metadata
      console.log('[通知] 其他用戶向我請求畫面', { metadata, call })

      // 被動回應此來電
      if (answerStream) {
        call.answer(answerStream)
      }

      // 因為是單向的，不播放對方畫面
      if (metadata.streamType === 'screen' && !metadata.single) {
        const { onStream, onClose, onError } = screenHandlers(get, set, call, call.metadata)
        call.on('stream', onStream).on('close', onClose).on('error', onError)
      }
    })

    // 所有連線設置完成(Socketio 與 Peerjs 皆建立連線)後，發起
    socket.emit('share-screen', myRoomId, myScreenPeerId, {
      userId: myUserId,
      peerId: myPeerId,
      audio: audio,
      video: video,
      streamType: 'screen',
      single: true,
    })
  },
  stopScreenShare: (props: StopShareScreenProps) => {
    const socket = get().socket!
    const myPeerId = get().myPeerId!
    const { myRoomId, myUserId } = props
    const { myScreenPeerId } = get()

    // 將所有與分享畫面有關的連線設置清空
    socket.emit('stop-share-screen', myRoomId, myScreenPeerId, {
      userId: myUserId,
      peerId: myPeerId,
      streamType: 'screen',
      single: true,
    })
  },
  createScreenStream: () => {
    set((state) => ({ screen: { ...state.screen, loading: true } }))

    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getDisplayMedia({
          video: {
            frameRate: 30,
            noiseSuppression: true,
          },
          audio: false,
        })
        .then((stream) => {
          // 這邊根據當前設置，選擇是否呈現畫面、是否靜音
          setStreamVideo(stream, get().screen.video)
          setStreamAudio(stream, get().screen.audio)
          set((state) => ({ screen: { ...state.screen, stream } }))
          resolve(stream)
        })
        .catch((error) => {
          set((state) => ({
            screen: { ...state.screen, error: 'get screen media failed' },
          }))
          reject(error)
        })
        .finally(() => {
          set((state) => ({ screen: { ...state.screen, loading: false } }))
        })
    })
  },
  removeScreenStream: () => {
    removeStream(get().screen.stream)
    set((state) => ({ screen: { ...state.screen, error: '', stream: null } }))
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
async function createPeer(myPeerId = ''): Promise<{ peer: Peer; myPeerId: string }> {
  const Peer = (await import('peerjs')).default
  const peer = new Peer(myPeerId, {
    host: 'localhost',
    port: 4001,
    path: '/peerjs',
  })
  return new Promise((resolve) => {
    peer.on('open', (myPeerId) => resolve({ peer, myPeerId }))
  })
}
