import { removeStream, setStreamVideo, setStreamAudio } from '@/lib/stream'
import { create } from 'zustand'

type Store = {
  stream: MediaStream | null
  loading: boolean
  error: string
  video: boolean
  audio: boolean
}

type Actions = {
  handleWebcamStream: (getWebcamStream: Promise<MediaStream>) => Promise<MediaStream>
  removeWebcamStream: () => void
  setWebcamVideo: (video: boolean) => void
  setWebcamAudio: (audio: boolean) => void
}

export const useWebcamStreamStore = create<Store & Actions>((set, get) => ({
  stream: null,
  loading: false,
  error: '',
  video: true,
  audio: false,
  handleWebcamStream: (getWebcamStream: Promise<MediaStream>) => {
    set(() => ({ loading: true }))
    return new Promise((resolve, reject) => {
      getWebcamStream
        .then((stream) => {
          // 根據使用者使用設定，選擇是否呈現畫面、是否靜音
          setStreamVideo(stream, get().video)
          setStreamAudio(stream, get().audio)
          set(() => ({ stream }))
          resolve(stream)
        })
        .catch((error) => {
          set(() => ({ error: 'get webcam media failed.' }))
          reject(error)
        })
        .finally(() => {
          set(() => ({ loading: false }))
        })
    })
  },
  removeWebcamStream: () => {
    removeStream(get().stream)
    set(() => ({ error: '', stream: null }))
  },
  setWebcamVideo: (nextState: boolean) => {
    setStreamVideo(get().stream, nextState)
    set(() => ({ video: nextState }))
  },
  setWebcamAudio: (nextState: boolean) => {
    setStreamAudio(get().stream, nextState)
    set(() => ({ audio: nextState }))
  },
}))
