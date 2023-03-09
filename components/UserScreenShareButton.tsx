import { useSockerPeerStore } from '@/stores/socketPeer'
import { useEffect, useMemo, useState } from 'react'
import { MdOutlineStopScreenShare, MdOutlineScreenShare } from 'react-icons/md'
import CircleButton from './CircleButton'

type Props = {
  roomId: string
  userId: string
}

const UserScreenShareButton = ({ roomId, userId = '' }: Props) => {
  // const [isScreenShare, setIsScreenShare] = useState(false)
  const { socket, screenShare, stopScreenShare, screen, remoteScreen, createScreenStream, removeScreenStream } =
    useSockerPeerStore()

  const handleScreenShare = async () => {
    if (!roomId || Array.isArray(roomId)) {
      alert('roomid is empty or invalid')
      return
    }

    try {
      if (!socket) {
        alert('必須先進入房間')
        return
      }

      const screenStream = await createScreenStream()
      // setIsScreenShare(true)

      screenShare({
        myRoomId: roomId,
        myUserId: userId,
        answerStream: screenStream,
        video: screen.video,
        audio: screen.audio,
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
      // setIsScreenShare(false)
    }
  }, [socket])

  const button = !!screen?.stream
    ? { bg: 'rgb(224 36 36)', icon: <MdOutlineStopScreenShare className="text-2xl" />, onClick: handleStopScreenShare }
    : { bg: 'rgb(4 116 129)', icon: <MdOutlineScreenShare className="text-2xl" />, onClick: handleScreenShare }

  return (
    // <>
    //   {!!screen?.stream ? (
    //     <button
    //       onClick={handleStopScreenShare}
    //       className="inline-flex items-center justify-center rounded-3xl bg-red-600 p-4 text-2xl text-white disabled:border-gray-600 disabled:text-gray-300"
    //       disabled={!socket}
    //     >
    //       <MdOutlineStopScreenShare />
    //     </button>
    //   ) : (
    //     <button
    //       onClick={handleScreenShare}
    //       className="inline-flex items-center justify-center rounded-3xl bg-teal-600 p-4 text-2xl text-white disabled:bg-gray-600 disabled:text-gray-300"
    //       disabled={!socket}
    //     >
    //       <MdOutlineScreenShare />
    //     </button>
    //   )}
    // </>
    <CircleButton
      style={{ background: button.bg }}
      onClick={button.onClick}
      disabled={!socket || !!remoteScreen?.stream}
    >
      {button.icon}
    </CircleButton>
  )
}

export default UserScreenShareButton
