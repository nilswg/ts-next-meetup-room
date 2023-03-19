import getAllDevices from '@/lib/getAllDevices'
import type { StoreGet, StoreSet } from '.'

export const getWebcamStream = (set: StoreSet, get: StoreGet) => (): Promise<MediaStream> => {
  const webcamId = get().webcamIds.id
  const webcamGroupId = get().webcamIds.groupId
  const microphoneId = get().microphoneIds.id
  const microphoneGroupId = get().microphoneIds.groupId

  // console.log('getWebcamStream', { webcamId, webcamGroupId })

  return new Promise((resolve, reject) => {
    getAllDevices().then(({ webcams, microphones, audios }) => {
      navigator.mediaDevices
        // 如果沒有視訊鏡頭或是麥克風設備，就會被設置為 false。
        .getUserMedia({
          video: webcams.length > 0 ? { deviceId: webcamId, groupId: webcamGroupId } : false,
          audio: microphones.length > 0 ? { deviceId: microphoneId, groupId: microphoneGroupId } : false,
        })
        .then((stream) => resolve(stream))
    })
  })
}
