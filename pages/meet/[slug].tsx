import MeetLayout from '@/components/MeetLayout'
import RemoteWebcamStreamBox from '@/components/RemoteWebcamStreamBox'
import ScreenBox from '@/components/ScreenBox'
import UserWebcamStreamBox from '@/components/UserWebcamStreamBox'
import useClient from '@/hooks/useClient'
import { useDevicesStore } from '@/stores/devices'
import { useSockerPeerStore } from '@/stores/socketPeer'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { useCallback, useEffect, useRef, useState } from 'react'

// import Image from 'next/image'
// import test from '/public/test.jpg'

type Props = {
  cookies: { [key: string]: string }
}

type WebcamProps = { type: 'user' } | { type: 'remote'; peerId: string; stream: MediaStream; userId: string }
type ScreenProps = { type: 'user' | 'remote'; peerId: string; stream: MediaStream; userId: string }

const debugMode = false

const Meet = ({ cookies }: Props) => {
  const router = useRouter()
  const { slug: roomId } = router.query
  const [userId, setUserId] = useState(cookies['USER_ID'])
  const {
    socket,
    resetWebcam,
    webcams: webcamsStore,
    screens: screensStore,
    handleWebcamStream,
    removeWebcamStream,
  } = useSockerPeerStore()
  const { webcamIds, microphoneIds, getWebcamStream, setMicrophoneIds, setWebcamIds } = useDevicesStore()
  const [webcams, setWebcams] = useState<WebcamProps[]>([])
  const [screens, setScreens] = useState<ScreenProps[]>([])
  const [fill, setFill] = useState(false)
  const [done, setDone] = useState(false)
  const permission = useRef<PermissionStatus | null>(null)

  const createWebcamStream = useCallback(() => {
    console.log('createWebcamStream')
    handleWebcamStream(getWebcamStream()).then(() => {
      if (!!socket) {
        resetWebcam({
          myRoomId: roomId as string,
          myUserId: userId,
        })
      }
    })
  }, [socket, handleWebcamStream, getWebcamStream, resetWebcam])

  // 進入meet分頁後，立刻啟動攝影機
  useClient(() => {
    const webcamIds = {
      id: cookies['WEBCAM_ID'],
      groupId: cookies['WEBCAM_GROUP_ID'],
    }
    setWebcamIds(webcamIds)
    const microphoneIds = {
      id: cookies['MICROPHONE_ID'],
      groupId: cookies['MICROPHONE_GROUP_ID'],
    }
    setMicrophoneIds(microphoneIds)
    setDone(true)
    return () => setDone(false)
  }, [])

  /** 如果使用者切換了攝影鏡頭，必須重新建立連線 */
  useEffect(() => {
    if (!!done) {
      console.log('permissions query')
      navigator.permissions.query({ name: 'camera' } as any).then((ps: PermissionStatus) => {
        permission.current = ps
        permission.current.onchange = function (f) {
          console.log('camera permission state has changed to ', this.state)
          if (this.state === 'granted' || this.state === 'prompt') {
            createWebcamStream()
          } else if (this.state === 'denied') {
            removeWebcamStream()
          }
        }
        createWebcamStream()
      })
    }
    return () => {
      console.log('remove')
      removeWebcamStream()

      if (permission.current) {
        permission.current.onchange = null
        permission.current = null
      }
    }
  }, [webcamIds.id, webcamIds.groupId, microphoneIds.id, microphoneIds.groupId, done])

  useClient(() => {
    if (!debugMode) {
      const _webcams: WebcamProps[] = []

      for (let i = 0, n = webcamsStore.length; i < n; i++) {
        _webcams.push({
          type: webcamsStore[i].type,
          peerId: webcamsStore[i].peerId,
          userId: webcamsStore[i].userId,
          stream: webcamsStore[i].stream!,
        })
      }

      console.log('numOfWebcams', _webcams)
      setWebcams(_webcams)
    }

    return () => {}
  }, [webcamsStore])

  useClient(() => {
    const _screens: ScreenProps[] = []

    for (let i = 0, n = screensStore.length; i < n; i++) {
      // 略過無串流的畫面
      if (!screensStore[i].stream) continue

      _screens.push({
        type: screensStore[i].type,
        peerId: screensStore[i].peerId,
        userId: screensStore[i].userId,
        stream: screensStore[i].stream!,
      })
    }

    console.log('numOfScreens', _screens)
    setScreens(_screens)

    return () => {}
  }, [screensStore])

  useClient(() => {
    const resize = () => {
      const _fill = window.innerWidth < 1024
      setFill(_fill)
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <MeetLayout
      debug={debugMode}
      roomId={roomId as string}
      userId={userId}
      webcams={webcams}
      setWebcams={setWebcams}
      screens={screens}
      setScreens={setScreens}
      ScreenComp={screens.map((ele, i) => {
        return (
          <div key={`screen_${i}`} className="relative flex h-full items-center justify-center">
            {ele.type === 'user' ? (
              <ScreenBox stream={ele.stream} peerId={ele.peerId} username={ele.userId} />
            ) : ele.type === 'remote' ? (
              <ScreenBox stream={ele.stream} peerId={ele.peerId} username={ele.userId} />
            ) : (
              <>
                <ScreenBox stream={ele.stream} peerId={ele.peerId} username={ele.userId} />
                {/* <Image src={test} alt="" fill={fill} className="object-contain" /> */}
                {/* <div className="absolute top-2 right-4 text-white">Top Right</div> */}
              </>
            )}
          </div>
        )
      })}
      WebcamCompHasScreen={webcams.map((ele, i) => {
        // console.log(ele.type)
        return (
          <div key={`webcam_${i}`} className="relative flex w-full items-center justify-center bg-none">
            {ele.type === 'user' ? (
              <UserWebcamStreamBox username={userId} fill={fill} />
            ) : ele.type === 'remote' ? (
              <RemoteWebcamStreamBox username={ele.userId} peerId={ele.peerId} stream={ele.stream} fill={fill} />
            ) : (
              // 供新增按鈕測試
              <>
                <UserWebcamStreamBox username={userId} fill={fill} />
                {/* <Image src={test} alt="" fill={fill} className="object-contain" /> */}
                {/* <div className="absolute top-2 right-4 text-white">Top Right</div> */}
              </>
            )}
          </div>
        )
      })}
      WebcamCompNoScreen={webcams.map((ele, i) => (
        <div key={`webcam_${i}`} className="relative flex justify-center bg-none">
          {ele.type === 'user' ? (
            <UserWebcamStreamBox username={userId} />
          ) : ele.type === 'remote' ? (
            <RemoteWebcamStreamBox username={ele.userId} peerId={ele.peerId} stream={ele.stream} />
          ) : (
            // 供新增按鈕測試
            <>
              <UserWebcamStreamBox username={userId} />
              {/* <Image src={test} alt="" className="object-contain" /> */}
              {/* <div className="absolute top-2 right-4 text-white">Top Right</div> */}
            </>
          )}
        </div>
      ))}
    />
  )
}
export default Meet

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      cookies: nookies.get(ctx),
      uuid: require('crypto').randomUUID(),
    },
  }
}
