import SideBar, { Button } from '@/components/SideBar'
import UserWebcamAudioButton from '@/components/UserWebcamAudioButton'
import UserEnterRoomButton from '@/components/UserEnterRoomButton'
import UserScreenShareButton from '@/components/UserScreenShareButton'
import UserWebcamVideoButton from '@/components/UserWebcamVideoButton'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import nookies from 'nookies'
import { useState } from 'react'

type Props = {
  cookies: { [key: string]: string }
}

const SidebarPage = ({ cookies }: Props) => {
  const router = useRouter()
  const { slug: roomId } = router.query
  const [userId, setUserId] = useState(cookies['USER_ID'])
  return (
    <>
      <Button/>
      <SideBar roomId={roomId as string} userId={userId} />
      <UserWebcamVideoButton />
      <UserWebcamAudioButton />
      <UserScreenShareButton roomId={roomId as string} userId={userId} />
      <UserEnterRoomButton roomId={roomId as string} userId={userId} />
    </>
  )
}

export default SidebarPage

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      cookies: nookies.get(ctx),
      uuid: require('crypto').randomUUID(),
    },
  }
}
