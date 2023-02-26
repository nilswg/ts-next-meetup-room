import React from 'react'
import 'dayjs/locale/zh-tw'
import dayjs from 'dayjs'

const Navbar = () => {
  return (
    <div className="fixed flex h-[5rem] w-full items-center justify-between border-b-[1px] border-gray-700 bg-gray-900 px-6 text-white">
      <h1 className="text-4xl">Nilswg Meet</h1>
      <h1>{dayjs().locale('zh-tw').format('A h:mm - MMM D日 ddd')}</h1>
    </div>
  )
}

export default Navbar
