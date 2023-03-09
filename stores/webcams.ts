import getAllDevices from '@/lib/getAllDevices'
import { create } from 'zustand'

type Store = {
  webcams: DeviceProps[]
  loading: boolean
  error: string
}

type Actions = {
  // setWebcams: (devices: DeviceProps[]) => void
  getWebcams: () => Promise<void>
}

export const useWebcamsStore = create<Store & Actions>((set, get) => ({
  webcams: [],
  loading: false,
  error: '',
  // setWebcams: (devices: DeviceProps[]) => {
  //   set(() => ({ webcams: devices }))
  // },
  getWebcams: async () => {
    set((state) => ({ loading: true }))
    return new Promise((resolve, reject) => {
      getAllDevices()
        .then(({ webcams }) => {
          set((state) => ({ webcams, loading: false }))
        })
        .catch((error) => {
          set((state) => ({ error: 'get devices failed.' }))
          reject('get devices failed.')
        })
        .finally(() => {
          set((state) => ({ loading: false }))
          resolve()
        })
    })
  },
}))
