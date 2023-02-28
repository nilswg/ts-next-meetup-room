import type { CreateStore } from '@/stores'

export type StreamStore = {
  // userId: string
  userStream: MediaStream | null
  video: boolean
  audio: boolean
  loading: boolean
  error: string
  // setUserId: (userId: string) => void
  createUserStream: () => void
  removeUserStream: () => void
  setUserVideo: (video: boolean) => void
  setUserAudio: (audio: boolean) => void
}

export const createStreamStore: CreateStore<StreamStore> = (set, get) => ({
  // userId: '',
  userStream: null,
  video: true,
  audio: true,
  loading: false,
  error: '',
  // setUserId: (userId: string) => {
  //   set(() => ({ userId }))
  // },
  createUserStream: async () => {
    set((state) => ({ loading: true }))

    try {

      // 這邊一定要全部開啟，意思為取得音源與視訊源。
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      console.log('createUserStream');
      set((state) => ({ userStream: stream }))

      // 這邊根據當前設置，選擇是否呈現畫面、是否靜音
      const {setUserAudio, setUserVideo, video, audio} = get()
      setUserAudio(audio)
      setUserVideo(video)

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
    set((state) => ({ userStream: null, error:'' }))
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
