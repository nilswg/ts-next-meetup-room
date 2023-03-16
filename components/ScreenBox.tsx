import { useCallback, useEffect, useRef, useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { TbPlugConnectedX } from 'react-icons/tb'

type Props = {
  peerId: string
  stream: MediaStream | null
  username: string
}

const ScreenBox = ({ peerId, stream = null, username = '' }: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [loading, setLoading] = useState(false)

  const playVideo = useCallback(() => {
    console.log('playVideo')
    if (ref?.current) {
      ref.current.play()
    }
  }, [ref])

  useEffect(() => {
    console.log('ScreenBox mount')
    if (ref?.current) {
      ref.current.srcObject = stream
      ref.current.addEventListener('loadedmetadata', playVideo)
    }
    return () => {
      console.log('ScreenBox unmount')
      if (ref?.current) {
        ref.current.removeEventListener('loadedmetadata', playVideo)
      }
    }
  }, [])

  return (
    <>
      {loading ? (
        <Loading />
      ) : !stream ? (
        <NoStream />
      ) : (
        <>
          <video ref={ref} className="h-full w-full bg-black object-contain" src=""></video>
          <div className="absolute top-0 left-4">
            <h1 className="text-3xl text-gray-400">{peerId.slice(0, 6)}</h1>
            <h1 className="text-5xl text-sky-400">{username}</h1>
          </div>
        </>
      )}
    </>
  )
}

function NoStream() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-900">
      <TbPlugConnectedX className="h-20 w-20 text-gray-700" />
    </div>
  )
}

function Loading() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-900">
      <CgSpinner className={`h-20 w-20 animate-[spin_1s_linear_infinite] text-sky-400`} />
    </div>
  )
}

export default ScreenBox
