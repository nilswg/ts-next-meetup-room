import { create } from 'zustand'

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

export const useDevicesStore = create<Store & Actions>((set, get, api) => ({
  webcamIds: { id: '', groupId: '' },
  microphoneIds: { id: '', groupId: '' },
  audioIds: { id: '', groupId: '' },
  setWebcamIds: (ids: DeviceIDs) => {
    set(() => ({ webcamIds: ids }))
  },
  setMicrophoneIds: (ids: DeviceIDs) => {
    set(() => ({ microphoneIds: ids }))
  },
  setAudioIds: (ids: DeviceIDs) => {
    set(() => ({ audioIds: ids }))
  },
  getWebcamStream: () => {
    return navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: get().webcamIds.id,
        groupId: get().webcamIds.groupId,
      },
      audio: {
        deviceId: get().microphoneIds.id,
        groupId: get().microphoneIds.groupId,
      },
    })
  }
}))
