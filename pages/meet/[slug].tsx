import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import VideoBox from '@/components/VideoBox'
import { useStores } from '@/stores'
import { CgSpinner } from 'react-icons/cg'

const Meet = () => {
  const router = useRouter()
  const { slug: roomId } = router.query
  const doOnce = useRef(false)
  const {
    loading,
    error,
    userStream,
    createUserStream,
    removeUserStream,
    enterMeeupRoom,
    remoteStreams,
    userId,
    myPeerId,
    socket,
    audio,
    setUserAudio,
    video,
    setUserVideo,
  } = useStores((state) => state)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    if (!doOnce?.current) {
      doOnce.current = true
      createUserStream()
    }
    return () => {
      removeUserStream()
    }
  }, [])

  const reconnect = () => {
    if (!!userStream) {
      removeUserStream()
    }
    createUserStream()
  }

  const remove = () => {
    removeUserStream()
  }

  const handleUserVedio = () => {
    setUserVideo(!video)
  }

  const handleUserAudio = () => {
    setUserAudio(!audio)
  }

  const letsMeet = () => {
    if (!roomId || Array.isArray(roomId)) {
      alert('roomid is empty or invalid')
      return
    }
    enterMeeupRoom(roomId)
  }

  return (
    <div className="">
      <h1 className="pt-[5rem] text-white">Meet | {roomId}</h1>
      <div className="grid auto-rows-[300px] grid-cols-[repeat(auto-fill,_300px)]">
        {error && <Error />}
        {loading ? (
          <Loading />
        ) : (
          <VideoBox stream={userStream!} peerId={myPeerId} username={userId}/>
        )}
        {remoteStreams.map((s) => (
          <VideoBox key={s.id} stream={s.stream} peerId={s.id} username={s.userId}></VideoBox>
        ))}
      </div>

      <button
        onClick={reconnect}
        className="w-[150px] border-[1px] border-white py-2 px-6 text-white disabled:border-gray-600 disabled:text-gray-600"
        disabled={loading}
      >
        Reconnect
      </button>
      <button
        onClick={remove}
        className="w-[150px] border-[1px] border-white py-2 px-6 text-white disabled:border-gray-600 disabled:text-gray-600"
      >
        Remove
      </button>
      <button
        onClick={handleUserVedio}
        className="w-[150px] border-[1px] border-white py-2 px-6 text-white disabled:border-gray-600 disabled:text-gray-600"
      >
        {video ? 'Video OFF' : 'Video ON'}
      </button>
      <button
        onClick={handleUserAudio}
        className="w-[150px] border-[1px] border-white py-2 px-6 text-white disabled:border-gray-600 disabled:text-gray-600"
      >
        {audio ? 'Audio OFF' : 'Audio ON'}
      </button>
      <button
        onClick={letsMeet}
        className="w-[150px] border-[1px] border-white py-2 px-6 text-white disabled:border-gray-600 disabled:text-gray-600"
        disabled={!!socket}
      >
        Let's Meet
      </button>
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

function Error() {
  return (
    <div className="flex h-full w-full items-center">
      <h1 className="w-full text-center text-4xl uppercase text-white">
        No Camera
      </h1>
    </div>
  )
}
