import type { CreateStore } from '@/stores'

export type StreamStore = {
  userId: string
  userStream: MediaStream | null
  video: boolean
  audio: boolean
  loading: boolean
  error: null | string
  setUserId: (userId: string) => void
  createUserStream: () => void
  removeUserStream: () => void
  setUserVideo: (video: boolean) => void
  setUserAudio: (audio: boolean) => void
}

export const createStreamStore: CreateStore<StreamStore> = (set, get) => ({
  userId: '',
  userStream: null,
  video: true,
  audio: true,
  loading: false,
  error: null,
  setUserId: (userId: string) => {
    set(() => ({ userId }))
  },
  createUserStream: async () => {
    set((state) => ({ loading: true }))

    try {
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: get().video,
        audio: get().audio,
      })
      set((state) => ({ userStream: stream }))
    } catch (error) {
      set((state) => ({ error: 'GetUserMedia Failed' }))
    } finally {
      set((state) => ({ loading: false }))
    }
  },
  removeUserStream: () => {
    get()
      .userStream?.getTracks()
      .forEach((track) => track.stop())
    set((state) => ({ userStream: null }))
  },
  setUserVideo: (nextState: boolean) => {
    get()
      .userStream?.getVideoTracks()
      .forEach((t) => (t.enabled = nextState))

    set(() => ({ video: nextState }))
  },
  setUserAudio: (nextState: boolean) => {
    get()
      .userStream?.getAudioTracks()
      .forEach((t) => (t.enabled = nextState))

    set(() => ({ audio: nextState }))
  },
})
