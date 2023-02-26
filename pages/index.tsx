import { useEffect, useState } from 'react'
import type { NextPageContext } from 'next'
import Link from 'next/link'
import { useStores } from '@/stores'
// import Image from 'next/image';
// import { Inter } from 'next/font/google';
// const inter = Inter({ subsets: ['latin'] });

type Props = {
  uuid: string
}

export default function Home({ uuid }: Props) {
  const [roomId, setRoomId] = useState(uuid)
  const { userId, setUserId } = useStores((s) => s)

  const onRoomIdChanged = (e: any) => {
    setRoomId(e.target.value)
  }

  const onUserIdChanged = (e: any) => {
    setUserId(e.target.value)
  }

  return (
    <div className="flex h-full items-center justify-center">
      <ul className="flex flex-col items-center justify-center gap-6 rounded-md px-10 py-20 shadow-xl shadow-gray-800">
        <li className="w-[25rem] text-white">
          <label htmlFor="userid">User ID:</label>
          <input
            className="mt-1 w-full rounded-sm border-[1px] border-gray-400 bg-gray-800 px-2 py-2"
            type="text"
            id="userid"
            value={userId}
            onChange={onUserIdChanged}
          />
        </li>
        <li className="w-[25rem] text-white">
          <label htmlFor="roomid">Room ID:</label>
          <input
            className="mt-1 w-full rounded-sm border-[1px] border-gray-400 bg-gray-800 px-2 py-2"
            type="text"
            id="roomid"
            value={roomId}
            onChange={onRoomIdChanged}
          />
        </li>
        <Link
          href={`/meet/${roomId}`}
          className="mt-6 rounded-md border-[1px] border-gray-400 px-6 py-3 text-white hover:bg-slate-600"
        >
          發起會議
        </Link>
      </ul>
    </div>
  )
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      uuid: require('crypto').randomUUID(),
    },
  }
}
