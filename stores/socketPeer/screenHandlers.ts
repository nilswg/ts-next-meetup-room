import { MediaConnection } from 'peerjs'
import { StoreGet, StoreSet } from '@/stores/socketPeer'
import { PeerMetadata } from '@/stores/socketPeer'

export const screenHandlers = (get: StoreGet, set: StoreSet, call: MediaConnection, data: PeerMetadata) => {
  return {
    onStream: (remoteStream: MediaStream) => {
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
    },
    onClose: () => {
      const userPeerId = data.peerId
      console.log('關閉他人畫面, PeerId:', userPeerId) // screenPeerId

      get().peerScreenMap.delete(userPeerId)

      set((state) => ({
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
    onError: (error: Error) => {
      const userPeerId = data.peerId
      console.log('關閉他人畫面, PeerId:', userPeerId) // screenPeerId

      get().peerScreenMap.delete(userPeerId)

      set((state) => ({
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
  }
}
