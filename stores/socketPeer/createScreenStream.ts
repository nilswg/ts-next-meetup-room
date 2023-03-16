import type { StoreGet, StoreSet } from '.'
import { setStreamAudio, setStreamVideo } from '@/lib/stream'

export const createScreenStream = (set: StoreSet, get: StoreGet) => (): Promise<MediaStream> => {
  set((state) => ({
    screens: state.screens.map((e) => (e.type === 'user' ? { ...e, loading: true } : e)),
  }))

  return new Promise((resolve, reject) => {
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          frameRate: 30,
          noiseSuppression: true,
        },
        audio: false,
      })
      .then((stream) => {
        // 這邊根據當前設置，選擇是否呈現畫面、是否靜音
        const screen = get().screens[0]
        setStreamVideo(stream, screen.video)
        setStreamAudio(stream, screen.audio)
        set((state) => ({
          screens: state.screens.map((e) => (e.type === 'user' ? { ...e, stream } : e)),
        }))
        resolve(stream)
      })
      .catch((error) => {
        set((state) => ({
          screens: state.screens.map((e) =>
            e.type === 'user' ? { ...e, error: error?.message ?? 'get screen media failed' } : e
          ),
        }))
        reject(error)
      })
      .finally(() => {
        set((state) => ({
          screens: state.screens.map((e) => (e.type === 'user' ? { ...e, loading: false } : e)),
        }))
      })
  })
}
