import type { Socket } from 'socket.io-client'
import type { MediaConnection } from 'peerjs'
import { socketHandlers } from './socketHandlers'
import { webcamHandlers } from './webcamHandlers'
import { StoreGet, StoreSet } from '.'
import createFakeStream from '@/lib/createFakeStream'
import { createPeer, createSocketIo } from '@/lib/createConnection'

export const enterMeetupRoom = (set: StoreSet, get: StoreGet) => async (props: EnterRoomProps) => {
  const { myRoomId, myUserId } = props
  const res = await Promise.all([createSocketIo(), createPeer()])
  const socket = res[0].socket as Socket<ServerToClientEvents, ClientToServerEvents>
  const { peer: myWebcamPeer, peerId: userPeerId } = res[1]
  const myUserPeerId = userPeerId
  const myWebcamPeerId = userPeerId
  const webcam = get().webcams[0]

  /**
   * 1. 連接到Peer服務器時，會獲得隨機的用戶識別，讓用戶之間能夠相互對接。
   *
   * 2. 我們將 Socketio 當作訊息通道，並使用 Peerjs 傳輸視訊流。
   *
   * 3. 連線時自動獲取代表使用者的 PeerId；且也作為 webcam 連入 peerId
   */
  set(() => ({ socket, myWebcamPeer, myUserPeerId, myWebcamPeerId }))

  // 監聽別人對我的來電 (當我加入房間，別人主動通知我)
  myWebcamPeer.on('call', (call: MediaConnection) => {
    console.log('[通知] 收到其他用戶來電', { call })

    // 被動回應此來電
    if (webcam.stream) {
      call.answer(webcam.stream)
    } else {
      const fakeStream = createFakeStream()
      call.answer(fakeStream)
    }

    // 播放對方視訊
    const { onStream, onClose, onError } = webcamHandlers(get, set, call, call.metadata)
    call.on('stream', onStream).on('close', onClose).on('error', onError)
  })

  const { userConnected, userDisconnected, userShareScreen, userStopShareScreen, userResetWebcam } = socketHandlers(
    get,
    set,
    myRoomId,
    myUserId,
    myUserPeerId,
    myWebcamPeer,
    myWebcamPeerId
  )

  socket.on('user-connected', userConnected)
  socket.on('user-disconnected', userDisconnected)
  socket.on('user-share-screen', userShareScreen)
  socket.on('user-stop-share-screen', userStopShareScreen)
  socket.on('user-reset-webcam', userResetWebcam)

  socket.emit('join-room', myRoomId, myUserPeerId, {
    userId: myUserId,
    userPeerId: myUserPeerId,
    peerId: myWebcamPeerId,
    streamType: 'webcam',
    video: webcam.video,
    audio: webcam.audio,
  })
}
