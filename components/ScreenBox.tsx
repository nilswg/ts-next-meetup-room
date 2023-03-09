import { useCallback, useEffect, useRef } from 'react';
import { TbPlugConnectedX } from 'react-icons/tb'

type Props = {
  peerId: string
  stream: MediaStream
  username: string
}

const ScreenBox = ({ peerId, stream, username = '' }: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null)

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
    <div className="relative h-[480px] w-[1080px] bg-slate-400">
      <div className="absolute top-0 left-4">
        <h1 className="text-3xl text-gray-400">{peerId.slice(0, 6)}</h1>
        <h1 className="text-5xl text-sky-400">{username}</h1>
      </div>
      {stream ? (
        <video
          ref={ref}
          className="h-full w-full bg-black object-cover"
          src=""
        ></video>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-black">
          <TbPlugConnectedX className="h-20 w-20 text-gray-700" />
        </div>
      )}
    </div>
  )
}

export default ScreenBox
