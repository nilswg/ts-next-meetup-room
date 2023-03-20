import { usePermissionsStore } from '@/stores/permissions'
import { useSocketPeerStore } from '@/stores/socketPeer'
import { FaVideo, FaVideoSlash } from 'react-icons/fa'
import CircleButton from './CircleButton'

function UserWebcamVideoButton() {
  const { webcams, setWebcamVideo } = useSocketPeerStore()
  const { webcamPermission } = usePermissionsStore()

  const { video } = webcams[0]

  const styles = video
    ? { bg: 'rgb(2 132 199)', icon: <FaVideo className="text-2xl" /> }
    : { bg: 'rgb(220 38 38)', icon: <FaVideoSlash className="text-2xl" /> }

  const handleVideo = () => {
    setWebcamVideo(!video)
  }

  return (
    <CircleButton
      style={{ background: styles.bg }}
      onClick={handleVideo}
      disabled={!webcamPermission}
      disabledText={'請開啟攝影機權限'}
    >
      {styles.icon}
    </CircleButton>
  )
}

export default UserWebcamVideoButton
