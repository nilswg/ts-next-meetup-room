import getAllDevices from '@/lib/getAllDevices'
import { create } from 'zustand'

type Store = {
  webcams: DeviceProps[]
  loading: boolean
  error: string
}

type Actions = {
  getWebcams: () => Promise<void>
}

export const useWebcamsStore = create<Store & Actions>((set, get) => ({
  webcams: [],
  loading: false,
  error: '',
  getWebcams: async () => {
    set(() => ({ loading: true }))
    return new Promise((resolve, reject) => {
      getAllDevices()
        .then(({ webcams }) => {
          set(() => ({ webcams, loading: false }))
        })
        .catch((error) => {
          set(() => ({ error: error?.message ?? 'get devices failed.' }))
          reject('get devices failed.')
        })
        .finally(() => {
          set(() => ({ loading: false }))
          resolve()
        })
    })
  },
}))
