import getAllDevices from '@/lib/getAllDevices'
import { create } from 'zustand'

type Store = {
  microphones: DeviceProps[]
  loading: boolean
  error: string
}

type Actions = {
  // setMicrophones: (devices: DeviceProps[]) => void
  getMicrophones: () => Promise<void>
}

export const useMicrophonesStore = create<Store & Actions>((set, get) => ({
  microphones: [],
  loading: false,
  error: '',
  // setMicrophones: (devices: DeviceProps[]) => {
  //   set(() => ({ microphones: devices }))
  // },
  getMicrophones: async () => {
    set((state) => ({ loading: true }))
    return getAllDevices()
      .then(({ microphones }) => {
        set((state) => ({ microphones, loading: false }))
      })
      .catch((error) => {
        set((state) => ({ error: 'Get devices failed.' }))
      })
      .finally(() => {
        set((state) => ({ loading: false }))
      })
  },
}))
