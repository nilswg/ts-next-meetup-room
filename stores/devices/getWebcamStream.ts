import type { StoreGet, StoreSet } from '.'

export const getWebcamStream = (set: StoreSet, get: StoreGet) => () => {
  const webcamId = get().webcamIds.id
  const webcamGroupId = get().webcamIds.groupId
  const microphoneId = get().microphoneIds.id
  const microphoneGroupId = get().microphoneIds.groupId

  return navigator.mediaDevices.getUserMedia({
    video: { deviceId: webcamId, groupId: webcamGroupId },
    audio: { deviceId: microphoneId, groupId: microphoneGroupId },
  })
}
