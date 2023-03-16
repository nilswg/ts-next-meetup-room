import React from 'react'
import VideoBox from './VideoBox'

type Props = {
  stream: MediaStream
  peerId: string
  username: string
  fill?: boolean
}

const RemoteWebcamStreamBox = ({ stream, peerId, username, fill = false }: Props) => {
  return <VideoBox stream={stream} peerId={peerId} username={username} fill={fill} />
}

export default RemoteWebcamStreamBox
