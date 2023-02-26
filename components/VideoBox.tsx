import React, { useCallback, useEffect, useRef } from 'react'
import { TbPlugConnectedX } from 'react-icons/tb'

const VideoBox = ({ stream }: { stream: MediaStream }) => {
  const ref = useRef<HTMLVideoElement | null>(null)

  const playVideo = useCallback(() => {
    console.log('playVideo')
    if (ref?.current) {
      ref.current.play()
    }
  }, [ref])

  useEffect(() => {
    console.log('mount')
    if (ref?.current) {
      ref.current.srcObject = stream
      ref.current.addEventListener('loadedmetadata', playVideo)
    }
    return () => {
      console.log('close')
      if (ref?.current) {
        ref.current.removeEventListener('loadedmetadata', playVideo)
        // stream.getTracks().forEach((track) => track.stop())
        // ref.current.srcObject = null
      }
    }
  }, [])

  return (
    <div>
      {stream ? (
        <video
          ref={ref}
          className="h-full w-full bg-black object-cover"
          src=""
          muted
        ></video>
      ) : (
        <div className="h-full w-full bg-black flex justify-center items-center">
          <TbPlugConnectedX className='w-20 h-20 text-gray-700'/>
        </div>
      )}
    </div>
  )
}

export default VideoBox
