import { createPeer } from '@/lib/createConnection'
import { MediaConnection } from 'peerjs'
import { StoreGet, StoreSet } from '.'
import { webcamHandlers } from './webcamHandlers'

export const resetWebcam =
  (set: StoreSet, get: StoreGet) =>
  async ({ myRoomId, myUserId }: ResetWebcamProps) => {
    const socket = get().socket!
    const myUserPeerId = get().myUserPeerId
    const lastWebcamPeer = get().myWebcamPeer!
    const webcam = get().webcams[0]

    // 重置攝影機，需要取得新的 peer 連線。
    const { peer: myWebcamPeer, peerId: myWebcamPeerId } = await createPeer()

    // 清除連線
    lastWebcamPeer.disconnect()

    // 更新狀態
    set((state) => ({
      myWebcamPeer,
      myWebcamPeerId,
      peerWebcamMap: new Map(),
      // 重置為僅保留自己的；清除其他人
      webcams: state.webcams.filter((e) => e.type !== 'remote'),
    }))

    socket.emit('reset-webcam', myRoomId, myUserPeerId, {
      userId: myUserId,
      userPeerId: myUserPeerId,
      peerId: myWebcamPeerId,
      streamType: 'webcam',
      video: webcam.video,
      audio: webcam.audio,
    })

    // 監聽別人對我的來電 (當我加入房間，別人主動通知我)
    myWebcamPeer.on('call', (call: MediaConnection) => {
      console.log('[通知] 收到其他用戶來電', { call })

      // 被動回應此來電
      if (webcam.stream) {
        call.answer(webcam.stream)
      }

      // 播放對方視訊
      const { onStream, onClose, onError } = webcamHandlers(get, set, call, call.metadata)
      call.on('stream', onStream).on('close', onClose).on('error', onError)
    })
  }
