import type { RootStore } from '.'

export type UserCamera = {
  muted: boolean
  camera: boolean
  setMuted: (enable: boolean) => void
  setCamera: (enable: boolean) => void
  hideCamera: (roomId: string) => void
  showCamera: (roomId: string) => void
}

export const createUserCameraStore = (
  set: (f: (s: RootStore) => Partial<RootStore>) => void,
  get: () => RootStore
): UserCamera => ({
  muted: true,
  camera: true,
  setMuted: (muted: boolean) => {
    set(() => ({ muted }))
  },
  setCamera: async (camera: boolean) => {
    set(() => ({ camera }))
  },
  hideCamera: (roomId: string) => {
    try {
      get()
        .userStream?.getTracks()
        .forEach((track) => track.stop())
      set((state) => ({ userStream: null }))

      const { socket, peerId } = get()

      socket!.emit('hide-camera', roomId, peerId)

      set(() => ({ camera: false }))
    } catch (error) {
      set((state) => ({ error: 'something wrong' }))
    }
  },
  showCamera: async (roomId: string) => {
    try {
      set((state) => ({ loading: true }))
      const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      set((state) => ({ userStream: stream, loading: false }))

      const { socket, peerId } = get()

      socket!.emit('show-camera', roomId, peerId)

      set(() => ({ camera: true }))
    } catch (error) {
      set((state) => ({ error: 'something wrong', loading: false }))
    }
  },
})
