import { MediaConnection } from 'peerjs'
import { StoreGet, StoreSet } from '@/stores'
import { PeerMetadata } from '@/stores/socketPeer'

export const peerHandlers = (
  get: StoreGet,
  set: StoreSet,
  call: MediaConnection,
  data: PeerMetadata
) => {
  return {
    onStream: (remoteStream: MediaStream) => {
      const peerMap = get().peerMap
      if (peerMap.has(call.peer)) return
      else {
        console.log('建立遠端串流, PeerId:', call.peer)
        peerMap.set(call.peer, call)
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
    },
    onClose: () => {
      console.log('建立遠端串流, PeerId:', call.peer)
      set((state) => ({
        remoteStreams: state.remoteStreams.filter((s) => s.id !== call.peer),
      }))
    },
    onError: (error: Error) => {
      console.log('建立遠端串流, PeerId:', call.peer)
      set((state) => ({
        remoteStreams: state.remoteStreams.filter((s) => s.id !== call.peer),
      }))
    },
  }
}
