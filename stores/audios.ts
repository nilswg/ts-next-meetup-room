import getAllDevices from '@/lib/getAllDevices'
import { create } from 'zustand'

type Store = {
  audios: DeviceProps[]
  loading: boolean
  error: string
}

type Actions = {
  getAudios: () => Promise<void>
}

export const useAudiosStore = create<Store & Actions>((set, get) => ({
  audios: [],
  loading: false,
  error: '',
  getAudios: async () => {
    set(() => ({ loading: true }))
    return getAllDevices()
      .then(({ audios }) => {
        set(() => ({ audios, loading: false }))
      })
      .catch((error) => {
        set(() => ({ error: error?.message ?? 'Get devices failed.' }))
      })
      .finally(() => {
        set(() => ({ loading: false }))
      })
  },
}))
