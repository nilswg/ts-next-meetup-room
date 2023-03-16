import { removeStream } from '@/lib/stream'
import type { StoreGet, StoreSet } from '.'

export const removeWebcamStream = (set: StoreSet, get: StoreGet) => () => {
  const webcam = get().webcams[0]
  removeStream(webcam.stream)
  set((state) => ({
    webcams: state.webcams.map((e) =>
      e.type === 'user'
        ? {
            ...e,
            peerId: '',
            userId: '',
            stream: null,
            error: '',
            loading: false,
          }
        : e
    ),
  }))
}
