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
  return new Promise((resolve, reject) => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
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
        if (!dev.deviceId || dev.deviceId === 'default') continue
        if (dev.kind === 'videoinput') {
          webcams.push(temp)
        } else if (dev.kind === 'audioinput') {
          microphones.push(temp)
        } else if (dev.kind === 'audiooutput') {
          audios.push(temp)
        }
      }

      console.log({ webcams })

      resolve({ webcams, microphones, audios })
    })
  })
}

export default getAllDevices
