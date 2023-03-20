import useClient from '@/hooks/useClient'
import { CSSProperties, ReactNode, useCallback, useRef, useState } from 'react'
import { TbFlipVertical } from 'react-icons/tb'

// import Image from 'next/image'
// import test from '/public/test.jpg'

const isProd = process.env['NODE_ENV'] === 'production'

type Props = {
  peerId: string
  stream: MediaStream
  username: string
  fill: boolean
  flipVideo?: boolean
}

const VideoBox = ({ peerId, stream, username = '', fill, flipVideo = false }: Props) => {
  const ref = useRef<HTMLVideoElement | null>(null)
  const [flip, setFlip] = useState(flipVideo)

  const playVideo = useCallback(() => {
    // console.log('video box play')
    if (ref?.current) {
      ref.current.play()
    }
  }, [ref])

  useClient(() => {
    // console.log('video box mount')
    if (ref?.current) {
      ref.current.srcObject = stream
      ref.current.addEventListener('loadedmetadata', playVideo)
    }
    return () => {
      // console.log('video box unmount')
      if (ref?.current) {
        ref.current.removeEventListener('loadedmetadata', playVideo)
        stream.getTracks().forEach((track) => track.stop())
        ref.current.srcObject = null
      }
    }
  }, [])

  const flipCamera = flip ? 'scale-x-[-1]' : ''

  const handleFlip = () => {
    setFlip((s) => !s)
  }

  const fillStyles = fill ? /*tw:*/ 'min-w-full min-h-full' : ''

  return (
    <>
      {/* <Image src={test} alt="" fill className="object-contain" /> */}
      <video ref={ref} className={`${fillStyles} object-contain ${flipCamera}`} src=""></video>
      <div className="absolute top-2 right-4">
        {!isProd && (
          <>
            <div className="text-4xl text-sky-400">{username}</div>
            <div className="text-2xl text-teal-400">{peerId.slice(0, 6)}</div>
          </>
        )}
        <Button style={{ backgroundColor: '' }} onClick={handleFlip}>
          <TbFlipVertical className="h-5 w-5" />
          <span className="sr-only">Flip Camera</span>
        </Button>
      </div>
    </>
  )
}

type ButtonProps = {
  children: ReactNode
  style: CSSProperties
  disabled?: boolean
  onClick: () => void
}

function Button({ children, style = {}, disabled = false, onClick }: ButtonProps) {
  const btnStyles: CSSProperties = disabled
    ? { backgroundColor: 'rgb(75 85 99)', color: 'rgb(209 213 219)', pointerEvents: 'none' }
    : { ...style, pointerEvents: 'auto' }

  return (
    <button
      type="button"
      data-te-ripple-init
      data-te-ripple-color="light"
      className={`inline-flex justify-center rounded-full border-[1px] border-neutral-700 p-2 text-xs font-medium uppercase leading-normal text-neutral-700  shadow-md transition duration-150 ease-in-out hover:bg-neutral-700 hover:text-white hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg dark:border-neutral-500 dark:text-neutral-500 dark:hover:text-white`}
      style={btnStyles}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default VideoBox
