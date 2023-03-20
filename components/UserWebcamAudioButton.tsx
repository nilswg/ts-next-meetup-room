import { usePermissionsStore } from '@/stores/permissions'
import { useSocketPeerStore } from '@/stores/socketPeer'
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa'
import CircleButton from './CircleButton'

function UserWebcamAudioButton() {
  const { webcams, setWebcamAudio } = useSocketPeerStore()

  const { microphonePermission } = usePermissionsStore()

  const { audio } = webcams[0]

  const styles = audio
    ? { bg: 'rgb(2 132 199)', icon: <FaMicrophone className="text-2xl" /> }
    : { bg: 'rgb(220 38 38)', icon: <FaMicrophoneSlash className="text-2xl" /> }

  const handleAudio = () => {
    setWebcamAudio(!audio)
  }
  return (
    <CircleButton
      style={{ background: styles.bg }}
      onClick={handleAudio}
      disabled={!microphonePermission}
      disabledText={'請開啟麥克風權限'}
    >
      {styles.icon}
    </CircleButton>
  )
}

export default UserWebcamAudioButton
