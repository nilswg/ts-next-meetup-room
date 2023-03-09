import { useSockerPeerStore } from '@/stores/socketPeer'
import VideoBox from '@/components/VideoBox'

const RemoteStreamVideos = () => {
  const { remoteStreams } = useSockerPeerStore()
  return (
    <>
      {Array.isArray(remoteStreams) &&
        remoteStreams.map((s) => <VideoBox key={s.id} stream={s.stream} peerId={s.id} username={s.userId}></VideoBox>)}
    </>
  )
}

export default RemoteStreamVideos
