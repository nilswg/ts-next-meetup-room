import { removeStream, setStreamVideo, setStreamAudio } from '@/lib/stream'
import { CreateStore } from '@/stores'

export type StreamStore = {
  user: {
    stream: MediaStream | null
    loading: boolean
    error: string
    video: boolean
    audio: boolean
  }
  createUserStream: () => void
  removeUserStream: () => void
  setUserVideo: (video: boolean) => void
  setUserAudio: (audio: boolean) => void
}

export const createStreamStore: CreateStore<StreamStore> = (set, get) => ({
  user: {
    stream: null,
    loading: false,
    error: '',
    video: true,
    audio: true,
  },
  createUserStream: async () => {
    set((state) => ({ user: { ...state.user, loading: true } }))
    try {
      // 這邊一定要全部開啟，意思為取得音源與視訊源。
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      console.log('createUserStream')

      // 這邊根據當前設置，選擇是否呈現畫面、是否靜音
      setStreamVideo(stream, get().user.video)
      setStreamAudio(stream, get().user.audio)

      set((state) => ({ user: { ...state.user, stream } }))
    } catch (error) {
      set((state) => ({
        user: { ...state.user, error: 'GetUserMedia Failed' },
      }))
    } finally {
      set((state) => ({ user: { ...state.user, loading: false } }))
    }
  },
  removeUserStream: () => {
    removeStream(get().user.stream)
    set((state) => ({ user: { ...state.user, error: '', stream: null } }))
  },
  setUserVideo: (nextState: boolean) => {
    setStreamVideo(get().user.stream, nextState)
    set((state) => ({ user: { ...state.user, video: nextState } }))
  },
  setUserAudio: (nextState: boolean) => {
    setStreamAudio(get().user.stream, nextState)
    set((state) => ({ user: { ...state.user, audio: nextState } }))
  },
})
