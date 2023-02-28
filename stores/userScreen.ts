import { removeStream, setStreamVideo } from '@/lib/stream'
import { CreateStore } from '@/stores'

export type ScreenStore = {
  screen: {
    stream: MediaStream | null
    error: string
    loading: boolean
    video: boolean
    audio: boolean
    frameRate: number
  }
  createScreenStream: () => void
  removeScreenStream: () => void
  setScreenVideo: (video: boolean) => void
}

export const createScreenStore: CreateStore<ScreenStore> = (set, get) => ({
  screen: {
    stream: null,
    loading: false,
    error: '',
    video: true,
    audio: false,
    frameRate: 30,
  },
  createScreenStream: async () => {
    set((state) => ({ screen: { ...state.screen, loading: true } }))
    try {
      // 這邊一定要全部開啟，意思為取得音源與視訊源。
      const stream: MediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: get().screen.frameRate },
        audio: false,
      })
      console.log('createScreenStream')

      // 這邊根據當前設置，選擇是否呈現畫面、是否靜音
      setStreamVideo(stream, get().screen.video)
      // setStreamAudio(stream, get().screen.audio)

      set((state) => ({ screen: { ...state.screen, stream } }))
    } catch (error) {
      set((state) => ({
        screen: { ...state.screen, error: 'GetScreenMedia Failed' },
      }))
    } finally {
      set((state) => ({ screen: { ...state.screen, loading: false } }))
    }
  },
  removeScreenStream: () => {
    removeStream(get().screen.stream)
    set((state) => ({ screen: { ...state.screen, error: '', stream: null } }))
  },
  setScreenVideo: (nextState: boolean) => {
    setStreamVideo(get().screen.stream, nextState)
    set((state) => ({ screen: { ...state.screen, video: nextState } }))
  },
})
