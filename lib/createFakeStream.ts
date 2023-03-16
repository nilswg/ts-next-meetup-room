function createFakeStream() {
  return new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack({ width: 0, height: 0 })])
}

function createEmptyAudioTrack() {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const dst = oscillator.connect(ctx.createMediaStreamDestination())
  oscillator.start()
  const track = (dst as AudioNode & { stream: any }).stream.getAudioTracks()[0]
  return Object.assign(track, { enabled: false })
}

function createEmptyVideoTrack({ width, height }: any) {
  const canvas = Object.assign(document.createElement('canvas'), {
    width,
    height,
  })
  const my2d = canvas.getContext('2d')
  if (!my2d) {
    alert('not support canvas 2d')
    return
  }
  my2d.fillRect(0, 0, width, height)
  const stream = canvas.captureStream()
  const track = stream.getVideoTracks()[0]

  return Object.assign(track, { enabled: false })
}

export default createFakeStream
