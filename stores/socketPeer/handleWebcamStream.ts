import type { StoreGet, StoreSet } from '.'
import { setStreamAudio, setStreamVideo } from '@/lib/stream'

export const handleWebcamStream =
  (set: StoreSet, get: StoreGet) =>
  (getWebcamStream: Promise<MediaStream>): Promise<MediaStream> => {
    set((state) => ({
      webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, loading: true, error: '' } : e)),
    }))
    return new Promise((resolve, reject) => {
      const webcam = get().webcams[0]
      getWebcamStream
        .then((stream) => {
          // 根據使用者使用設定，選擇是否呈現畫面、是否靜音
          setStreamVideo(stream, webcam.video)
          setStreamAudio(stream, webcam.audio)
          set((state) => ({
            webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, stream } : e)),
          }))
          resolve(stream)
        })
        .catch((error) => {
          set((state) => ({
            webcams: state.webcams.map((e) =>
              e.type === 'user' ? { ...e, error: error?.message ?? 'get webcam media failed' } : e
            ),
          }))
          reject(error)
        })
        .finally(() => {
          set((state) => ({
            webcams: state.webcams.map((e) => (e.type === 'user' ? { ...e, loading: false } : e)),
          }))
        })
    })
  }
