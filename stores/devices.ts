import { DeviceProps } from '@/components/DevicesSelector'
import { setStreamAudio, setStreamVideo } from '@/lib/stream'
import { create } from 'zustand'

export type DeviceIDs = {
  id: string
  groupId: string
}

type Store = {
  webcamIds: DeviceIDs // 視訊鏡頭
  microphoneIds: DeviceIDs // 麥克風
  audioIds: DeviceIDs // 音響喇叭
  webcams: DeviceProps[]
  microphones: DeviceProps[]
  audios: DeviceProps[]
}

type Actions = {
  setWebcamIds: (ids: DeviceIDs) => void
  setMicrophoneIds: (ids: DeviceIDs) => void
  setAudioIds: (ids: DeviceIDs) => void
  setWebcams: (devices: DeviceProps[]) => void
  setMicrophones: (devices: DeviceProps[]) => void
  setAudios: (devices: DeviceProps[]) => void
  getDevicesList: () => Promise<void>
  getWebcamStream: () => Promise<MediaStream>
  getWebcams: () => Promise<void>
  getMicrophones: () => Promise<void>
  getAudios: () => Promise<void>
}

export const useDevicesStore = create<Store & Actions>((set, get, api) => ({
  webcamIds: { id: '', groupId: '' },
  microphoneIds: { id: '', groupId: '' },
  audioIds: { id: '', groupId: '' },
  webcams: [],
  microphones: [],
  audios: [],
  webcamDeviceId: '',
  microphoneDeviceId: '',
  setWebcamIds: (ids: DeviceIDs) => {
    set(() => ({ webcamIds: ids }))
  },
  setMicrophoneIds: (ids: DeviceIDs) => {
    set(() => ({ microphoneIds: ids }))
  },
  setAudioIds: (ids: DeviceIDs) => {
    set(() => ({ audioIds: ids }))
  },
  setWebcams: (devices: DeviceProps[]) => {
    set(() => ({ webcams: devices }))
  },
  setMicrophones: (devices: DeviceProps[]) => {
    set(() => ({ microphones: devices }))
  },
  setAudios: (devices: DeviceProps[]) => {
    set(() => ({ audios: devices }))
  },
  getDevicesList: async () => {
    const [settings, devices] = await Promise.all([
      getVideoAndAudioSettings(),
      getAllDevices(),
    ])
    // 取得初始設備參數
    const [_video, _audio] = settings
    // 取得所有設備清單
    const { webcams, microphones, audios } = devices

    console.log('video', JSON.stringify(_video))
    console.log('audio', JSON.stringify(_audio))

    set(() => ({
      // 使用 videoTrack 取得當前的攝影機
      // 使用 audioTrack 取得當前的麥克風
      // webcamIds: {
      //   id: _video.deviceId ?? '',
      //   groupId: _video.groupId ?? '',
      // },
      // microphoneIds: {
      //   id: _audio.deviceId ?? '',
      //   groupId: _audio.groupId ?? '',
      // },
      webcams,
      microphones,
      audios,
    }))
  },
  getWebcams: async () => {
    const { webcams } = await getAllDevices()
    set((state) => ({ webcams }))
  },
  getMicrophones: async () => {
    const { microphones } = await getAllDevices()
    set((state) => ({ microphones }))
  },
  getAudios: async () => {
    const { audios } = await getAllDevices()
    set((state) => ({ audios }))
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
  },
}))

async function getVideoAndAudioSettings(
  debug = false
): Promise<[MediaTrackSettings, MediaTrackSettings]> {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  })
  const videos = stream.getVideoTracks().map((track) => track.getSettings())
  const audios = stream.getAudioTracks().map((track) => track.getSettings())
  return [videos[0], audios[0]]
}

async function getAllDevices(debug = false): Promise<{
  webcams: DeviceProps[]
  microphones: DeviceProps[]
  audios: DeviceProps[]
}> {
  // 列舉出所有設備
  const webcams: DeviceProps[] = []
  const microphones: DeviceProps[] = []
  const audios: DeviceProps[] = []

  // 列出所有攝影機與麥克風
  const devices: MediaDeviceInfo[] =
    await navigator.mediaDevices.enumerateDevices()

  // Debug
  if (debug) {
    devices.forEach((device) => {
      const shortId = device.deviceId.slice(0, 6)
      console.log(`${device.kind}: ${device.label}, id = ${shortId}`)
    })
  }

  for (let i = 0, n = devices.length; i < n; i++) {
    const dev = devices[i]
    const temp: DeviceProps = {
      id: dev.deviceId,
      label: dev.label,
      groupId: dev.groupId,
      kind: dev.kind,
      // isDefault: dev.label.includes('預設'),
    }
    if (dev.deviceId === 'default') continue
    if (dev.kind === 'videoinput') {
      webcams.push(temp)
    } else if (dev.kind === 'audioinput') {
      microphones.push(temp)
    } else if (dev.kind === 'audiooutput') {
      audios.push(temp)
    }
  }

  return { webcams, microphones, audios }
}
