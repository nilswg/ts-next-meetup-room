export function setStreamVideo(stream: MediaStream | null, nextState: boolean) {
  if (!stream) return
  stream.getVideoTracks().forEach((t) => (t.enabled = nextState))
}

export function setStreamAudio(stream: MediaStream | null, nextState: boolean) {
  if (!stream) return
  stream.getAudioTracks().forEach((t) => (t.enabled = nextState))
}

export function removeStream(stream: MediaStream | null) {
  if (!stream) return
  stream.getTracks().forEach((track) => track.stop())
}
