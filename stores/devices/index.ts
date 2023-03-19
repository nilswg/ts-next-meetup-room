import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getWebcamStream } from './getWebcamStream'

type Store = {
  webcamIds: DeviceIDs // 視訊鏡頭
  microphoneIds: DeviceIDs // 麥克風
  audioIds: DeviceIDs // 音響喇叭
}

type Actions = {
  setWebcamIds: (ids: DeviceIDs) => void
  setMicrophoneIds: (ids: DeviceIDs) => void
  setAudioIds: (ids: DeviceIDs) => void
  getWebcamStream: () => Promise<MediaStream>
}

export type StoreSet = (f: (state: Store) => Partial<Store>) => void

export type StoreGet = () => Store

export const useDevicesStore = create(
  persist<Store & Actions>(
    (set, get, api) => ({
      webcamIds: { id: '', groupId: '' },
      microphoneIds: { id: '', groupId: '' },
      audioIds: { id: '', groupId: '' },
      setWebcamIds: (ids: DeviceIDs) => {
        const webcamId = ids?.id ?? get().webcamIds.id ?? ''
        const webcamGroupId = ids?.groupId ?? get().webcamIds.groupId ?? ''
        set(() => ({ webcamIds: { id: webcamId, groupId: webcamGroupId } }))
      },
      setMicrophoneIds: (ids: DeviceIDs) => {
        const microphoneId = ids?.id ?? get().microphoneIds.id ?? ''
        const microphoneGroupId = ids?.groupId ?? get().microphoneIds.groupId ?? ''
        // setCookie(null, 'MICROPHONE_ID', ids.id, {
        //   maxAge: 30 * 24 * 60 * 60,
        //   path: '/',
        // })
        // setCookie(null, 'MICROPHONE_GROUP_ID', ids.groupId, {
        //   maxAge: 30 * 24 * 60 * 60,
        //   path: '/',
        // })
        set(() => ({ microphoneIds: { id: microphoneId, groupId: microphoneGroupId } }))
      },
      setAudioIds: (ids: DeviceIDs) => {
        // setCookie(null, 'AUDIO_ID', ids.id, {
        //   maxAge: 30 * 24 * 60 * 60,
        //   path: '/',
        // })
        // setCookie(null, 'AUDIO_GROUP_ID', ids.groupId, {
        //   maxAge: 30 * 24 * 60 * 60,
        //   path: '/',
        // })
        set(() => ({ audioIds: ids }))
      },
      getWebcamStream: getWebcamStream(set, get),
    }),
    { name: 'devices' }
  )
)
