import getAllDevices from '@/lib/getAllDevices'
import { create } from 'zustand'

type Store = {
  microphones: DeviceProps[]
  loading: boolean
  error: string
}

type Actions = {
  getMicrophones: () => Promise<void>
}

export const useMicrophonesStore = create<Store & Actions>((set, get) => ({
  microphones: [],
  loading: false,
  error: '',
  getMicrophones: async () => {
    set(() => ({ loading: true }))
    return getAllDevices()
      .then(({ microphones }) => {
        set(() => ({ microphones, loading: false }))
      })
      .catch((error) => {
        set(() => ({ error: error?.message ?? 'Get devices failed.' }))
      })
      .finally(() => {
        set(() => ({ loading: false }))
      })
  },
}))
