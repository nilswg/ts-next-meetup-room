import 'dayjs/locale/zh-tw'
import dayjs from 'dayjs'

const Navbar = () => {
  return (
    <div className="relative flex h-[4rem] w-full flex-wrap items-center justify-between bg-neutral-900 py-3 text-neutral-200 shadow-lg lg:flex-wrap lg:justify-start">
      <div className="flex w-full flex-wrap items-center justify-between px-6">
        <h1 className="text-4xl">Nilswg Meet</h1>
        <h1>{dayjs().locale('zh-tw').format('A h:mm - MMM D日 ddd')}</h1>
      </div>
    </div>
  )
}

export default Navbar
