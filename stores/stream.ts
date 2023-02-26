import type { CreateStore } from '.'

export type RemoteStream = {
  id: string
  stream: MediaStream
  muted: boolean
}

export type StreamStore = {
  userStream: MediaStream | null
  remoteStreams: Array<RemoteStream>
  loading: boolean
  error: null | string
  getUserStream: () => void
  removeUserStream: () => void
}

export const createStreamStore: CreateStore<StreamStore> = (set, get) => ({
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
      set((state) => ({ userStream: stream, loading: false, camera: true }))
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
})
