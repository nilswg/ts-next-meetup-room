import { useSocketPeerStore } from '@/stores/socketPeer'
import { useEffect } from 'react'
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md'
import CircleButton from './CircleButton'

type Props = {
  roomId: string
  userId: string
}

const UserScreenShareButton = ({ roomId, userId = '' }: Props) => {
  const {
    socket,
    screenShare,
    stopScreenShare,
    screens,
    removeScreenStream,
    shareScreenLoading: loading,
  } = useSocketPeerStore()

  const screen = screens[0]
  const remoteScreen = screens.filter((e) => e.type === 'remote')[0]

  const handleScreenShare = async () => {
    if (!roomId || Array.isArray(roomId)) {
      alert('roomId is empty or invalid')
      return
    }

    try {
      if (!socket) {
        alert('必須先進入房間')
        return
      }
      screenShare({
        myRoomId: roomId,
        myUserId: userId,
      })
    } catch (error) {
      console.error(error)
      return
    }
  }

  const handleStopScreenShare = () => {
    removeScreenStream()
    stopScreenShare({
      myRoomId: roomId,
      myUserId: userId,
    })
  }

  useEffect(() => {
    if (!socket && !!screen.stream) {
      console.log('因為連線中斷，關閉畫面')
      removeScreenStream()
    }
  }, [socket])

  const button = !!screen?.stream
    ? { bg: 'rgb(224 36 36)', icon: <MdOutlineStopScreenShare className="text-2xl" />, onClick: handleStopScreenShare }
    : { bg: 'rgb(4 116 129)', icon: <MdOutlineScreenShare className="text-2xl" />, onClick: handleScreenShare }

  return (
    <CircleButton
      style={{ background: button.bg }}
      onClick={button.onClick}
      disabled={!socket || !!remoteScreen?.stream || !!loading}
      loading={loading}
    >
      {button.icon}
    </CircleButton>
  )
}

export default UserScreenShareButton
