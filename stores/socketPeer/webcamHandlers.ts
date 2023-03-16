import { MediaConnection } from 'peerjs'
import { Store, StoreGet, StoreSet } from '@/stores/socketPeer'

export const webcamHandlers = (get: StoreGet, set: StoreSet, call: MediaConnection, data: PeerMetadata) => {
  return {
    onStream: (remoteStream: MediaStream) => {
      if (data.streamType === 'webcam') {
        const peerWebcamMap = get().peerWebcamMap
        const userPeerId = data.userPeerId
        const webcamPeerId = data.peerId

        if (!peerWebcamMap.has(userPeerId)) {
          console.log('建立他人視訊')
          console.log('建立peerWebcamMap', { userPeerId, webcamPeerId })
          peerWebcamMap.set(userPeerId, { webcamPeerId, call })

          // webcam
          set((state: Store) => ({
            webcams: [
              ...state.webcams,
              {
                type: 'remote',
                peerId: data.peerId,
                userId: data.userId,
                stream: remoteStream,
                error: '',
                loading: false,
                video: data.video,
                audio: data.audio,
              },
            ],
          }))
        }
      // } else if (data.streamType === 'screen') {
      //   const peerScreenMap = get().peerScreenMap
      //   const userPeerId = data.userPeerId
      //   const screenPeerId = data.peerId

      //   if (!peerScreenMap.has(data.userPeerId)) {
      //     console.log('建立他人畫面')
      //     console.log('建立peerScreenMap', { userPeerId, screenPeerId })
      //     peerScreenMap.set(userPeerId, { screenPeerId, call })

      //     // screen
      //     set((state) => ({
      //       screens: [
      //         ...state.screens,
      //         {
      //           type: 'remote',
      //           peerId: data.peerId,
      //           userId: data.userId,
      //           stream: remoteStream,
      //           error: '',
      //           loading: false,
      //           video: data.video,
      //           audio: data.audio,
      //           frameRate: data.frameRate ?? 30,
      //         },
      //       ],
      //     }))
      //   }
      }
    },
    onClose: () => {
      closeRemoteWebcam(get, set, data.userPeerId)
    },
    onError: (error: Error) => {
      closeRemoteWebcam(get, set, data.userPeerId)
    },
  }
}

function closeRemoteWebcam(get: StoreGet, set: StoreSet, remoteUserPeerId: string) {
  console.log('關閉用戶視訊串流', remoteUserPeerId)
  const webcam = get().peerWebcamMap.get(remoteUserPeerId)
  if (!webcam) return

  console.log({ webcam })

  get().peerWebcamMap.delete(remoteUserPeerId)

  set((state) => ({
    webcams: state.webcams.filter((e) => e.peerId !== webcam.webcamPeerId),
  }))
}
