import AudioSelector from '@/components/AudioSelector'
import MicrophoneSelector from '@/components/MicrophoneSelector'
import VideoBox from '@/components/VideoBox'
import WebcamSelector from '@/components/WebcamSelector'
import useClient from '@/hooks/useClient'
import { useDevicesStore } from '@/stores/devices'
import { useWebcamStreamStore } from '@/stores/webcamStream'
import { useMemo, useRef } from 'react'
import { CgSpinner } from 'react-icons/cg'
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa'
import { TbPlugConnectedX } from 'react-icons/tb'

const WebcamePage = () => {
  // const {
  //   // setWebcams,
  //   // setMicrophones,
  //   webcamIds,
  //   // setWebcamIds,
  //   microphoneIds,
  //   // setMicrophoneIds,
  //   // getInitialDevicesProps,
  //   getNewMediaStreamOnChange,
  // } = useDevicesStore()
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState('')
  // const [audio, setAudio] = useState(false)
  // const [video, setVideo] = useState(true)
  // const [webcams, setWebcams] = useState<DeviceProps[]>([])
  // const [microphones, setMicrophones] = useState<DeviceProps[]>([])
  // const [webcamIds, setWebcamIds] = useState({ id: '', groupId: '' })
  // const [microphoneIds, setMicrophoneIds] = useState({ id: '', groupId: '' })

  console.log('WebcamePage rerender')
  // const userStream = useRef<MediaStream | null>(null)
  // const done = useRef(false)

  // useClient(() => {
  //   console.log('webpage mounted')
  //   ;(async () => {
  //     if (!navigator?.mediaDevices) {
  //       console.log('mediaDevices not supported.')
  //       setError('mediaDevices not supported')
  //     }

  //     try {
  //       console.log(await getInitialDevicesProps())
  //     } catch (error) {
  //       console.error(error)
  //       setError('Get webcams and microphones failed.')
  //     }

  //     console.log('Initialization completed.')
  //   })()

  //   done.current = true

  //   return () => {
  //     done.current = false
  //   }
  // }, [])

  // useEffect(() => {
  //   if (!done.current) return
  //   console.log('get user media start.')
  //   setLoading(true)

  //   getNewMediaStreamOnChange()
  //     .then((stream) => {
  //       // 取得串流，並設置是否開啟畫面與播放聲音。
  //       setStreamAudio(stream, audio)
  //       setStreamVideo(stream, video)
  //       userStream.current = stream
  //       console.log('get user media sucessfully.')
  //     })
  //     .catch((err) => {
  //       console.log(err)
  //       setError('get user media failed.')
  //     })
  //     .finally(() => {
  //       setLoading(false)
  //     })
  // }, [done.current, webcamIds, microphoneIds])

  // const handleVideo = () => {
  //   setVideo((s) => {
  //     setStreamVideo(userStream.current, !s)
  //     return !s
  //   })
  // }

  // const handleAudio = () => {
  //   setAudio((s) => {
  //     setStreamAudio(userStream.current, !s)
  //     return !s
  //   })
  // }

  return (
    <div className="pt-[5rem] text-white">
      <h1>WebcamePage</h1>
      <div className="grid auto-rows-[400px] grid-cols-[repeat(auto-fill,_400px)]">
        {/* {error && <Error err={error} />}
        {loading ? (
          <Loading />
        ) : !userStream?.current ? (
          <NoStream />
        ) : (
          <VideoBox
            stream={userStream.current!}
            peerId={'peerId'}
            username={'username'}
          />
        )} */}
        <UserStreamVideoBox />
        {/* {remoteStreams.map((s) => (
          <VideoBox
            key={s.id}
            stream={s.stream}
            peerId={s.id}
            username={s.userId}
          ></VideoBox>
        ))} */}
      </div>
      <div className="flex w-[400px] gap-2">
        {/* <div onClick={handleVideo}>
          {video ? (
            <div className="flex items-center justify-center rounded-full bg-sky-600 p-2 text-2xl text-white">
              <FaVideo />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full bg-red-600 p-2 text-2xl text-white">
              <FaVideoSlash />
            </div>
          )}
        </div> */}
        <UserVideoButton />
        {/* <div onClick={handleAudio}>
          {audio ? (
            <div className="flex items-center justify-center rounded-full bg-sky-600 p-2 text-2xl text-white">
              <FaMicrophone />
            </div>
          ) : (
            <div className="flex items-center justify-center rounded-full bg-red-600 p-2 text-2xl text-white">
              <FaMicrophoneSlash />
            </div>
          )}
        </div> */}
        <UserAudioButton />
        {/* <DevicesSelector devices={webcams} setDeviceIds={setWebcamIds}/>
        <DevicesSelector devices={microphones} setDeviceIds={setMicrophoneIds}/> */}
        <WebcamSelector />
        <MicrophoneSelector />
        <AudioSelector />
      </div>
      <UserAudioSpeaker />
    </div>
  )
}

// interface MyAudioContext extends AudioContext {
//   setSinkId(sinkId: string): Promise<void>
// }

type MyMediaAudioSource =
  | MediaElementAudioSourceNode
  | MediaStreamAudioSourceNode

function UserAudioSpeaker() {
  const { audioIds } = useDevicesStore((s) => s)
  const { stream } = useWebcamStreamStore()

  const ref = useRef<HTMLAudioElement | null>(null)
  const audioCtx = useRef<AudioContext | null>(null)
  const srcMusic = useRef<MediaElementAudioSourceNode | null>(null)
  const srcStream = useRef<MediaStreamAudioSourceNode | null>(null)

  // 將音訊播放設備切換為指定的設備
  useClient(() => {
    if (stream && ref.current) {
      // 創建一個 AudioContext 和 MediaElementAudioSourceNode 來處理音訊
      // AudioContext 是 Web Audio API 的核心，它提供了一個音頻處理環境
      if (!audioCtx?.current) {
        audioCtx.current = new AudioContext()
      }

      // source 一個可被加工、操作或輸出的音訊來源，如麥克風、媒體流或是預先載入
      // 的音訊檔案等。此處能替換成其他聲音來源，例如視訊的串流等
      if (!srcMusic.current) {
        srcMusic.current = audioCtx.current.createMediaElementSource(
          ref.current
        )
      }
      if (!srcStream.current) {
        srcStream.current = audioCtx.current.createMediaStreamSource(stream)
      }

      // 強制轉型成MyAudioContext類型，解決在TypeScript中，setSinkId方法不存在的問題。
      if ('setSinkId' in AudioContext.prototype) {
        // ;(audioCtx.current as MyAudioContext).setSinkId(audioIds.id)
        audioCtx.current.setSinkId(audioIds.id)
      }

      srcMusic.current.connect(audioCtx.current.destination)
      srcStream.current.connect(audioCtx.current.destination)
      ref.current.play()
    }

    return () => {}
  }, [audioIds])

  return (
    <div>
      <h1>音效</h1>
      <audio ref={ref} controls autoPlay={true}>
        <source src="/mp3/music.mp3" type="audio/mpeg" />
      </audio>
    </div>
  )
}

function UserVideoButton() {
  const { video, setWebcamVideo } = useWebcamStreamStore((s) => s)
  const handleVideo = () => {
    setWebcamVideo(!video)
  }
  return (
    <div onClick={handleVideo}>
      {video ? (
        <div className="flex items-center justify-center rounded-full bg-sky-600 p-2 text-2xl text-white">
          <FaVideo />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-full bg-red-600 p-2 text-2xl text-white">
          <FaVideoSlash />
        </div>
      )}
    </div>
  )
}

function UserAudioButton() {
  const { audio, setWebcamAudio } = useWebcamStreamStore((s) => s)
  const handleAudio = () => {
    setWebcamAudio(!audio)
  }
  return (
    <div onClick={handleAudio}>
      {audio ? (
        <div className="flex items-center justify-center rounded-full bg-sky-600 p-2 text-2xl text-white">
          <FaMicrophone />
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-full bg-red-600 p-2 text-2xl text-white">
          <FaMicrophoneSlash />
        </div>
      )}
    </div>
  )
}

function UserStreamVideoBox() {
  const { webcamIds, microphoneIds, getWebcamStream } = useDevicesStore()
  const { error, loading, stream, handleWebcamStream } = useWebcamStreamStore()
  // const [loading, setLoading] = useState(false)
  // const [error, setError] = useState('')
  // const [audio, setAudio] = useState(false)
  // const [video, setVideo] = useState(true)
  // const userStream = useRef<MediaStream | null>(null)

  useClient(() => {
    handleWebcamStream(getWebcamStream())
    return () => {}
  }, [webcamIds, microphoneIds])

  return (
    <>
      {error && <Error err={error} />}
      {loading ? (
        <Loading />
      ) : !stream ? (
        <NoStream />
      ) : (
        <VideoBox stream={stream!} peerId={'peerId'} username={'username'} />
      )}
    </>
  )
}

function NoStream() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <TbPlugConnectedX className="h-20 w-20 text-gray-700" />
    </div>
  )
}

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

export default WebcamePage
