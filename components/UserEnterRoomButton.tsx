import { useDevicesStore } from '@/stores/devices'
import { useSockerPeerStore } from '@/stores/socketPeer'
import { useEffect } from 'react'
import { ImPhoneHangUp, ImPhone } from 'react-icons/im'
import CircleButton from './CircleButton'

type Props = {
  roomId: string
  userId: string
}

const UserEnterRoomButton = ({ roomId, userId }: Props) => {
  const {
    socket,
    enterMeeupRoom,
    leaveMeeupRoom,
  } = useSockerPeerStore()

  const leaveMeet = () => {
    leaveMeeupRoom()
  }

  const startMeet = async () => {
    // 連線到 Socket Server
    if (!!socket) {
      leaveMeeupRoom()
    }
    enterMeeupRoom({
      myRoomId: roomId,
      myUserId: userId,
    })
  }

  const button = !!socket
    ? { bg: 'rgb(224 36 36)', icon: <ImPhoneHangUp className="text-2xl" />, onClick: leaveMeet }
    : { bg: 'rgb(4 116 129)', icon: <ImPhone className="text-2xl" />, onClick: startMeet }

  return (
    <CircleButton style={{ background: button.bg }} onClick={button.onClick}>
      {button.icon}
    </CircleButton>
  )
}

export default UserEnterRoomButton
