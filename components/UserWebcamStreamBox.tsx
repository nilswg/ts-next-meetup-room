import { useSocketPeerStore } from '@/stores/socketPeer'
import { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import { BsCameraVideoOff } from 'react-icons/bs'
import VideoBox from './VideoBox'

type Props = {
  username: string
  fill?: boolean
}

const UserWebcamStreamBox = ({ username, fill = false }: Props) => {
  const { myWebcamPeerId, webcams } = useSocketPeerStore()
  const { error, loading, stream } = webcams[0]

  if (!stream) {
    return <NoStream />
  }

  const flipMyVideo = !(stream!.getVideoTracks()[0] as MediaStreamTrack & { noFlip: boolean }).noFlip

  return (
    <>
      {error && <Error err={error} />}
      {loading ? (
        <Loading />
      ) : (
        <VideoBox stream={stream} peerId={myWebcamPeerId} username={username} fill={fill} flipVideo={flipMyVideo} />
      )}
    </>
  )
}

function NoStream() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-900">
      <BsCameraVideoOff className="h-20 w-20 text-gray-700" />
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

function Error({ err }: { err: string }) {
  const [close, setClose] = useState(false)

  const onClose = () => {
    setClose(!close)
  }

  return (
    <div className={`absolute z-10 ${close ? 'hidden' : ''}`}>
      <div
        id="toast-danger"
        className="mb-4 flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow dark:bg-gray-800 dark:text-gray-400"
        role="alert"
      >
        <div className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Error icon</span>
        </div>
        <div className="ml-3 text-sm font-normal">{err}</div>
        <button
          type="button"
          className="-mx-1.5 -my-1.5 ml-auto inline-flex h-8 w-8 rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
          data-dismiss-target="#toast-danger"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="sr-only">Close</span>
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default UserWebcamStreamBox
