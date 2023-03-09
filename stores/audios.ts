import getAllDevices from '@/lib/getAllDevices'
import { create } from 'zustand'

type Store = {
  audios: DeviceProps[]
  loading: boolean
  error: string
}

type Actions = {
  // setAudios: (devices: DeviceProps[]) => void
  getAudios: () => Promise<void>
}

export const useAudiosStore = create<Store & Actions>((set, get) => ({
  audios: [],
  loading: false,
  error: '',
  // setAudios: (devices: DeviceProps[]) => {
  //   set(() => ({ audios: devices }))
  // },
  getAudios: async () => {
    set((state) => ({ loading: true }))
    return getAllDevices()
      .then(({ audios }) => {
        set((state) => ({ audios, loading: false }))
      })
      .catch((error) => {
        set((state) => ({ error: 'Get devices failed.' }))
      })
      .finally(() => {
        set((state) => ({ loading: false }))
      })
  },
}))
