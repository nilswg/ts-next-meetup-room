import UserAudioSelector from '@/components/UserAudioSelector'
import UserMicrophoneSelector from '@/components/UserMicrophoneSelector'
import UserWebcamVideoButton from '@/components/UserWebcamVideoButton'
import UserAudioSpeaker from '@/components/UserAudioSpeaker'
import UserWebcamStreamBox from '@/components/UserWebcamStreamBox'
import UserWebcamAudioButton from '@/components/UserWebcamAudioButton'
import UserWebcamSelector from '@/components/UserWebcamSelector'
import { useCallback, useEffect, useRef, useState } from 'react'
import useClient from '@/hooks/useClient'
import { useDevicesStore } from '@/stores/devices'
import { useSockerPeerStore } from '@/stores/socketPeer'

const WebcamePage = () => {
  const roomId = 'RoomId'
  const userId = 'UserId'
  const { socket, resetWebcam } = useSockerPeerStore()
  const { webcamIds, microphoneIds, getWebcamStream } = useDevicesStore()
  const { handleWebcamStream, removeWebcamStream } = useSockerPeerStore()
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

  return (
    <div className="pt-[5rem] text-white">
      <h1>WebcamePage</h1>
      <div className="grid auto-rows-[400px] grid-cols-[repeat(auto-fill,_400px)]">
        <UserWebcamStreamBox username="Test" />
        <div className="p-4">
          <div className="my-2 flex flex-row gap-2">
            <UserWebcamVideoButton />
            <UserWebcamAudioButton />
          </div>
          <div className="mt-4">
            <UserWebcamSelector />
            <UserMicrophoneSelector />
            <UserAudioSelector />
          </div>
          <div>
            <UserAudioSpeaker />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WebcamePage
