import { useSocketPeerStore } from '@/stores/socketPeer'
import { ImPhoneHangUp, ImPhone } from 'react-icons/im'
import CircleButton from './CircleButton'

type Props = {
  roomId: string
  userId: string
}

const UserEnterRoomButton = ({ roomId, userId }: Props) => {
  const { socket, enterMeetupRoom, leaveMeetupRoom, enterRoomLoading: loading } = useSocketPeerStore()

  const leaveMeet = () => {
    leaveMeetupRoom()
  }

  const startMeet = async () => {
    // 連線到 Socket Server
    if (!!socket) {
      leaveMeetupRoom()
    }
    enterMeetupRoom({
      myRoomId: roomId,
      myUserId: userId,
    })
  }

  const button = !!socket
    ? { bg: 'rgb(224 36 36)', icon: <ImPhoneHangUp className="text-2xl" />, onClick: leaveMeet }
    : { bg: 'rgb(4 116 129)', icon: <ImPhone className="text-2xl" />, onClick: startMeet }

  return (
    <CircleButton style={{ background: button.bg }} onClick={button.onClick} disabled={loading} loading={loading}>
      {button.icon}
    </CircleButton>
  )
}

export default UserEnterRoomButton
