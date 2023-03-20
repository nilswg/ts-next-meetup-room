import { useState } from 'react'
import type { NextPageContext } from 'next'
import Link from 'next/link'
import nookies, { setCookie } from 'nookies'
import FormField from '@/components/FormField'
// import Image from 'next/image';
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });

interface Props {
  uuid: string
  cookies: { [key: string]: string }
}

export default function Home({ uuid, cookies }: Props) {
  const [roomId, setRoomId] = useState(uuid)
  const [userId, setUserId] = useState(cookies['USER_ID'])

  const onRoomIdChanged = (e: any) => {
    setRoomId(e.target.value)
  }

  const onUserIdChanged = (e: any) => {
    setCookie(null, 'USER_ID', e.target.value, {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    setUserId(e.target.value)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
      <div className="block max-w-lg rounded-lg bg-white p-8 shadow-lg dark:bg-neutral-700">
        <form className='w-[20rem]'>
          <FormField text={'用戶名稱'} id={'userid'} value={userId} onChange={onUserIdChanged} />

          <FormField text={'房間名稱'} id={'roomid'} value={roomId} onChange={onRoomIdChanged} />

          <Link
            href={`/meet/${roomId}`}
            className="rounded bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
            data-te-ripple-init
            data-te-ripple-color="light"
          >
            進入房間
          </Link>
        </form>
      </div>
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
