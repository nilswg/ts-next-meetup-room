import { useDevicesStore } from '@/stores/devices'
import { useSockerPeerStore } from '@/stores/socketPeer'
import { useWebcamStreamStore } from '@/stores/webcamStream'
import { useEffect } from 'react'
import { ImPhoneHangUp, ImPhone } from 'react-icons/im'
import CircleButton from './CircleButton'

type Props = {
  roomId: string
  userId: string
}

const UserEnterRoomButton = ({ roomId, userId }: Props) => {
  const { socket, enterMeeupRoom, leaveMeeupRoom, resetWebcam } = useSockerPeerStore()
  const { stream: webcamStream, video, audio } = useWebcamStreamStore()

  const { getWebcamStream, webcamIds } = useDevicesStore()
  const { handleWebcamStream } = useWebcamStreamStore()
  // console.log('webcamStream', webcamStream)

  const leaveMeet = () => {
    leaveMeeupRoom()
  }

  const startMeet = async () => {
    // 連線到 Socket Server
    if (!!socket) {
      leaveMeet()
    }
    enterMeeupRoom({
      myRoomId: roomId,
      myUserId: userId,
      answerStream: webcamStream,
      video,
      audio,
    })
  }

  /** 如果使用者切換了攝影鏡頭，必須重新建立連線 */
  useEffect(() => {
    if (!!socket) {
      handleWebcamStream(getWebcamStream())
        .then((stream: MediaStream) => {
          // 重新配置視訊連線。
          resetWebcam({
            myRoomId: roomId,
            myUserId: userId,
            newWebcamStream: stream,
            video,
            audio,
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [webcamIds])

  const button = !!socket
    ? { bg: 'rgb(224 36 36)', icon: <ImPhoneHangUp className="text-2xl" />, onClick: leaveMeet }
    : { bg: 'rgb(4 116 129)', icon: <ImPhone className="text-2xl" />, onClick: startMeet }

  return (
    <>
      {/* //   <button
      //     onClick={leaveMeet}
      //     className="inline-flex items-center justify-center rounded-3xl bg-red-600  px-4 py-2 text-2xl text-white disabled:border-gray-600 disabled:text-gray-300"
      //   >
      //     <ImPhoneHangUp />
      //   </button>
      // ) : (
      //   <button
      //     onClick={startMeet}
      //     className="inline-flex items-center justify-center rounded-3xl bg-teal-600 px-4  py-2 text-2xl text-white disabled:bg-gray-600 disabled:text-gray-300"
      //     disabled={!!socket}
      //   >
      //     <ImPhone />
      //   </button> */}

      <CircleButton style={{ background: button.bg }} onClick={button.onClick}>
        {button.icon}
      </CircleButton>
    </>
  )
}

export default UserEnterRoomButton
