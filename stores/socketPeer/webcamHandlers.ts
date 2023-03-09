import { MediaConnection } from 'peerjs'
import { StoreGet, StoreSet } from '@/stores/socketPeer'
import { PeerMetadata } from '@/stores/socketPeer'

export const webcamHandlers = (get: StoreGet, set: StoreSet, call: MediaConnection, data: PeerMetadata) => {
  return {
    onStream: (remoteStream: MediaStream) => {
      if (data.streamType === 'webcam') {
        const peerMap = get().peerMap
        if (!peerMap.has(call.peer)) {
          console.log('建立遠端串流, PeerId:', call.peer)
          peerMap.set(call.peer, call)

          const metadata: PeerMetadata = call.metadata

          // webcam
          set((state) => ({
            remoteStreams: [
              ...state.remoteStreams,
              {
                id: call.peer,
                stream: remoteStream,
                userId: data.userId,
                video: data.video,
                audio: data.audio,
              },
            ],
          }))
        }
      } else if (data.streamType === 'screen') {
        const peerScreenMap = get().peerScreenMap
        if (!peerScreenMap.has(call.peer)) {
          const userPeerId = data.peerId
          const screenPeerId = call.peer

          console.log('建立他人畫面')
          console.log('建立peerScreenMap', { userPeerId, screenPeerId })
          peerScreenMap.set(userPeerId, { screenPeerId, call })

          // screen
          set((state) => ({
            remoteScreen: {
              peerId: screenPeerId,
              stream: remoteStream,
              userId: data.userId,
              video: data.video,
              audio: data.audio,
              frameRate: 30,
              error: state.remoteScreen.error,
              loading: state.remoteScreen.loading,
            },
          }))
        }
      }
    },
    onClose: () => {
      console.log('清除遠端串流, PeerId:', call.peer)

      get().peerMap.delete(call.peer)

      set((state) => ({
        remoteStreams: state.remoteStreams.filter((s) => s.id !== call.peer),
      }))
    },
    onError: (error: Error) => {
      console.log('清除遠端串流, PeerId:', call.peer)

      get().peerMap.delete(call.peer)

      set((state) => ({
        remoteStreams: state.remoteStreams.filter((s) => s.id !== call.peer),
      }))
    },
  }
}
