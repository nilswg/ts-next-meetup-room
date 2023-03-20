import { create } from 'zustand'

type Store = {
  webcamPermission: boolean
  microphonePermission: boolean
}

type Actions = {
  usePermissionQuery: (name: string) => Promise<[PermissionState, PermissionStatus]>
  setWebcamPermission: (nextSate: boolean) => void
  setMicrophonePermission: (nextSate: boolean) => void
}

export const usePermissionsStore = create<Store & Actions>((set, get) => ({
  webcamPermission: false,
  microphonePermission: false,
  usePermissionQuery: async (name: string) => {
    const permission = await navigator.permissions.query({ name } as any)
    return [permission.state, permission]
  },
  setWebcamPermission: (nextSate: boolean) => {
    set(() => ({ webcamPermission: nextSate }))
  },
  setMicrophonePermission: (nextSate: boolean) => {
    set(() => ({ microphonePermission: nextSate }))
  },
}))
