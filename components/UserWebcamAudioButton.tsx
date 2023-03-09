import { useWebcamStreamStore } from '@/stores/webcamStream'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import CircleButton from './CircleButton'

function UserWebcamAudioButton() {
  const { audio, setWebcamAudio } = useWebcamStreamStore()

  const styles = audio
  ? { bg: 'rgb(2 132 199)', icon: <FaMicrophone className="text-2xl" /> }
  : { bg: 'rgb(220 38 38)', icon: <FaMicrophoneSlash className="text-2xl" /> }

  const handleAudio = () => {
    setWebcamAudio(!audio)
  }
  return (
    <CircleButton style={{ background: styles.bg }} onClick={handleAudio}>
      {styles.icon}
    </CircleButton>
  )
}

export default UserWebcamAudioButton
