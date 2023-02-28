import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import VideoBox from '@/components/VideoBox'
import { useStores } from '@/stores'
import { CgSpinner } from 'react-icons/cg'
import { MdOutlineScreenShare, MdOutlineStopScreenShare } from 'react-icons/md'
import nookies from 'nookies'

import {
  FaVideo,
  FaVideoSlash,
  FaMicrophoneSlash,
  FaMicrophone,
} from 'react-icons/fa'

import { ImPhone, ImPhoneHangUp } from 'react-icons/im'

import { NextPageContext } from 'next'

type Props = {
  cookies: { [key: string]: string }
}

const Meet = ({ cookies }: Props) => {
  const [userId, setUserId] = useState(cookies['USER_ID'])
  const router = useRouter()
  const { slug: roomId } = router.query
  const doOnce = useRef(false)
  const {
    user,
    createUserStream,
    removeUserStream,
    enterMeeupRoom,
    leaveMeeupRoom,
    remoteStreams,
    myPeerId,
    socket,
    setUserAudio,
    setUserVideo,
    isScreenShare,
    screenShare,
    stopScreenShare,
    createScreenStream
  } = useStores((state) => state)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    if (!doOnce?.current) {
      doOnce.current = true
      createUserStream()
    }
    return () => {
      removeUserStream()
      leaveMeeupRoom()
    }
  }, [])

  // 離開房間不會中斷關閉攝影機
  const leaveMeet = () => {
    leaveMeeupRoom()
  }

  const handleUserVedio = () => {
    setUserVideo(!user.video)
  }

  const handleUserAudio = () => {
    setUserAudio(!user.audio)
  }

  const letsMeet = async () => {
    if (!roomId || Array.isArray(roomId)) {
      alert('roomid is empty or invalid')
      return
    }
    if (!user.stream) {
      removeUserStream()
      await createUserStream()
      enterMeeupRoom(roomId, userId ?? '')
    } else {
      enterMeeupRoom(roomId, userId ?? '')
    }
  }

  return (
    <div className="">
      <h1 className="pt-[5rem] text-white">Meet | {roomId}</h1>
      <div>
        <video className="h-[480px] w-[640px] bg-slate-400 " src=""></video>
      </div>
      <div className="grid auto-rows-[300px] grid-cols-[repeat(auto-fill,_300px)]">
        {user.error && <Error err={user.error} />}
        {user.loading ? (
          <Loading />
        ) : (
          <VideoBox
            stream={user.stream!}
            peerId={myPeerId}
            username={userId ?? ''}
          />
        )}
        {remoteStreams.map((s) => (
          <VideoBox
            key={s.id}
            stream={s.stream}
            peerId={s.id}
            username={s.userId}
          ></VideoBox>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleUserVedio}
          className="inline-block  disabled:border-gray-600 disabled:text-gray-600"
        >
          {user.video ? (
            <div className="flex items-center justify-center rounded-full bg-sky-600 p-2 text-2xl text-white">
              <FaVideo />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full bg-red-600 p-2 text-2xl text-white">
              <FaVideoSlash />
            </div>
          )}
        </button>
        <button
          onClick={handleUserAudio}
          className="inline-block  disabled:border-gray-600 disabled:text-gray-600"
        >
          {user.audio ? (
            <div className="flex items-center justify-center rounded-full bg-sky-600 p-2 text-2xl text-white">
              <FaMicrophone />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full bg-red-600 p-2 text-2xl text-white">
              <FaMicrophoneSlash />
            </div>
          )}
        </button>

        {isScreenShare ? (
          <button
            onClick={stopScreenShare}
            className="inline-flex items-center justify-center rounded-3xl bg-red-600  px-4 py-2 text-2xl text-white disabled:border-gray-600 disabled:text-gray-300"
          >
            <MdOutlineStopScreenShare />
          </button>
        ) : (
          <button
            onClick={screenShare}
            className="inline-flex items-center justify-center rounded-3xl bg-teal-600 px-4  py-2 text-2xl text-white disabled:bg-gray-600 disabled:text-gray-300"
            disabled={!!socket}
          >
            <MdOutlineScreenShare />
          </button>
        )}

        {!!socket ? (
          <button
            onClick={leaveMeet}
            className="inline-flex items-center justify-center rounded-3xl bg-red-600  px-4 py-2 text-2xl text-white disabled:border-gray-600 disabled:text-gray-300"
          >
            <ImPhoneHangUp />
          </button>
        ) : (
          <button
            onClick={letsMeet}
            className="inline-flex items-center justify-center rounded-3xl bg-teal-600 px-4  py-2 text-2xl text-white disabled:bg-gray-600 disabled:text-gray-300"
            disabled={!!socket}
          >
            <ImPhone />
          </button>
        )}
      </div>
    </div>
  )
}
export default Meet

function Loading() {
  return (
    <div className="flex items-center justify-center bg-gray-900">
      <CgSpinner
        className={`h-10 w-10 animate-[spin_1s_linear_infinite] text-sky-400`}
      />
    </div>
  )
}

function Error({ err }: { err: string }) {
  return (
    <div className="flex h-full w-full items-center">
      <h1 className="w-full text-center text-4xl text-white">{err}</h1>
    </div>
  )
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      cookies: nookies.get(ctx),
      uuid: require('crypto').randomUUID(),
    },
  }
}
