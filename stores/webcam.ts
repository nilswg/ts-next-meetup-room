import { removeStream, setStreamVideo, setStreamAudio } from '@/lib/stream'
import { CreateStore } from '@/stores'

export type WebcamStore = {
  webcam: {
    stream: MediaStream | null
    loading: boolean
    error: string
    video: boolean
    audio: boolean
  }
  createWebcamStream: () => void
  removeWebcamStream: () => void
  setWebcamVideo: (video: boolean) => void
  setWebcamAudio: (audio: boolean) => void
}

export const createWebcamStore: CreateStore<WebcamStore> = (set, get) => ({
  webcam: {
    stream: null,
    loading: false,
    error: '',
    video: true,
    audio: false,
  },
  createWebcamStream: async () => {
    set((state) => ({ webcam: { ...state.webcam, loading: true } }))
    try {
      // 這邊一定要全部開啟，意思為取得音源與視訊源。
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      console.log('createWebcamStream')

      // 這邊根據當前設置，選擇是否呈現畫面、是否靜音
      setStreamVideo(stream, get().webcam.video)
      setStreamAudio(stream, get().webcam.audio)

      set((state) => ({ webcam: { ...state.webcam, stream } }))
    } catch (error) {
      set((state) => ({
        webcam: { ...state.webcam, error: 'GetUserMedia Failed' },
      }))
    } finally {
      set((state) => ({ webcam: { ...state.webcam, loading: false } }))
    }
  },
  removeWebcamStream: () => {
    removeStream(get().webcam.stream)
    set((state) => ({ webcam: { ...state.webcam, error: '', stream: null } }))
  },
  setWebcamVideo: (nextState: boolean) => {
    setStreamVideo(get().webcam.stream, nextState)
    set((state) => ({ webcam: { ...state.webcam, video: nextState } }))
  },
  setWebcamAudio: (nextState: boolean) => {
    setStreamAudio(get().webcam.stream, nextState)
    set((state) => ({ webcam: { ...state.webcam, audio: nextState } }))
  },
})
