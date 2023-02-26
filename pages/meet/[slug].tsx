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
    userId,
    userStream,
    getUserStream,
    removeUserStream,
    enterMeeupRoom,
    remoteStreams,
    socket,
    peerId,
    camera,
    muted,
    setMuted,
    setCamera,
    hideCamera,
    showCamera,
  } = useStores((state) => state)

  useEffect(() => {
    if (typeof navigator === 'undefined') return
    if (!doOnce?.current) {
      doOnce.current = true
      getUserStream()
    }
    return () => {
      removeUserStream()
    }
  }, [])

  const reconnect = () => {
    if (!!userStream) {
      removeUserStream()
    }
    getUserStream()
  }

  const remove = () => {
    removeUserStream()
  }

  const handleCamera = async() => {
    if (!roomId || Array.isArray(roomId)) {
      alert('roomid is empty or invalid')
      return
    }
    if (!socket) {
      alert('no socket')
      return
    }
    if (camera) {
      hideCamera(roomId)
    } else {
      // 重新取得
      showCamera(roomId)
    }
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
        {loading ? <Loading /> : <VideoBox stream={userStream!} muted={muted} username={userId}/>}
        {remoteStreams.map((s) => (
          <VideoBox key={s.id} stream={s.stream} muted={s.muted} username={s.id}></VideoBox>
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
        onClick={handleCamera}
        className="w-[150px] border-[1px] border-white py-2 px-6 text-white disabled:border-gray-600 disabled:text-gray-600"
      >
        {camera ? 'HideCamera' : 'OpenCamera'}
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
