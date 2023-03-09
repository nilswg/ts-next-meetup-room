import { useRouter } from 'next/router'
import { useState } from 'react'
import { CgSpinner } from 'react-icons/cg'
import nookies from 'nookies'

import { NextPageContext } from 'next'
import UserWebcamVideoButton from '@/components/UserWebcamVideoButton'
import UserWebcamAudioButton from '@/components/UserWebcamAudioButton'
import UserWebcamStreamBox from '@/components/UserWebcamStreamBox'
import UserScreenShareButton from '@/components/UserScreenShareButton'
import UserEnterRoomButton from '@/components/UserEnterRoomButton'
import RemoteStreamVideos from '@/components/RemoteStreamVideos'
import { useSockerPeerStore } from '@/stores/socketPeer'
import ScreenBox from '@/components/ScreenBox'
import SideBar from '@/components/SideBar'

type Props = {
  cookies: { [key: string]: string }
}

const Meet = ({ cookies }: Props) => {
  const router = useRouter()
  const { slug: roomId } = router.query
  const [userId, setUserId] = useState(cookies['USER_ID'])

  return (
    <>
      <SideBar roomId={roomId as string} userId={userId} />
      <div className="p-6">
        <h1 className="mt-3 mb-6 text-white">Meet | {roomId}</h1>
        {/* 分享螢幕 */}
        <UserScreen />
        <UserRemoteScreen />
        <div className="grid auto-rows-[300px] grid-cols-[repeat(auto-fill,_300px)]">
          <UserWebcamStreamBox username={userId} />
          {/* 他人視訊 */}
          <RemoteStreamVideos />
        </div>
        <div className="flex w-[300px] pt-2 pb-3 flex-row items-center justify-center gap-2 rounded-b-full bg-neutral-200 dark:bg-neutral-600">
          <UserWebcamVideoButton />
          <UserWebcamAudioButton />
          <UserScreenShareButton roomId={roomId as string} userId={userId} />
          <UserEnterRoomButton roomId={roomId as string} userId={userId} />
        </div>
      </div>
    </>
  )
}
export default Meet

function UserScreen() {
  const { screen } = useSockerPeerStore()
  return <>{!!screen?.stream && <ScreenBox stream={screen.stream!} peerId={''} username={''} />}</>
}

function UserRemoteScreen() {
  const { remoteScreen } = useSockerPeerStore()
  return <>{!!remoteScreen?.stream && <ScreenBox stream={remoteScreen.stream!} peerId={''} username={''} />}</>
}

function Loading() {
  return (
    <div className="flex items-center justify-center bg-gray-900">
      <CgSpinner className={`h-10 w-10 animate-[spin_1s_linear_infinite] text-sky-400`} />
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

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      cookies: nookies.get(ctx),
      uuid: require('crypto').randomUUID(),
    },
  }
}
