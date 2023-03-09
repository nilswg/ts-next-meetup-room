import { useWebcamStreamStore } from '@/stores/webcamStream'
import { FaVideo, FaVideoSlash } from 'react-icons/fa'
import CircleButton from './CircleButton'

function UserWebcamVideoButton() {
  const { video, setWebcamVideo } = useWebcamStreamStore()

  const styles = video
    ? { bg: 'rgb(2 132 199)', icon: <FaVideo className="text-2xl" /> }
    : { bg: 'rgb(220 38 38)', icon: <FaVideoSlash className="text-2xl" /> }

  const handleVideo = () => {
    setWebcamVideo(!video)
  }

  return (
    <CircleButton style={{ background: styles.bg }} onClick={handleVideo}>
      {styles.icon}
    </CircleButton>
  )
}

export default UserWebcamVideoButton
