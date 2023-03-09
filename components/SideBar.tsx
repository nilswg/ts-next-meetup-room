import { useSidebarStore } from '@/stores/sidebar'
import { useEffect } from 'react'
import { TbArrowBarLeft, TbArrowBarRight } from 'react-icons/tb'
import UserAudioSelector from './UserAudioSelector'
import UserMicrophoneSelector from './UserMicrophoneSelector'
import UserWebcamSelector from './UserWebcamSelector'

export const Button = () => {
  const { open, setOpen } = useSidebarStore()

  const button = open
    ? {
        icon: TbArrowBarLeft,
      }
    : {
        icon: TbArrowBarRight,
      }

  return (
    <div className="text-center">
      <button
        className="absolute top-[4rem] left-0 m-1 inline-flex items-center rounded-full border border-neutral-700 p-1 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-neutral-300 dark:border-neutral-500 dark:text-neutral-500 dark:hover:text-white dark:focus:ring-neutral-800"
        type="button"
        onClick={() => setOpen(true)}
      >
        <button.icon className="h-5 w-5" />
        <span className="sr-only">Show navigation</span>
      </button>
    </div>
  )
}

const ControlPanel = ({ children }: any) => {
  const { open, setOpen } = useSidebarStore()

  useEffect(() => {
    console.log('open', open)
  }, [open])

  const translate = open ? 'translate-x-0' : '-translate-x-full'

  return (
    <>
      {/* drawer button */}
      <Button />
      {/* drawer component */}
      <div
        id="drawer-navigation"
        className={`fixed top-0 left-0 z-40 h-screen w-64 ${translate} overflow-y-auto bg-white p-4 transition-transform dark:bg-gray-800`}
      >
        <h5 id="drawer-navigation-label" className="text-base font-semibold uppercase text-gray-500 dark:text-gray-400">
          Settings
        </h5>
        <button
          type="button"
          className="absolute top-2.5 right-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => setOpen(false)}
        >
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
          <span className="sr-only">Close Setting Menu</span>
        </button>
        {children}
      </div>
    </>
  )
}

type Props = {
  roomId: string
  userId: string
}

const SideBar = ({ roomId, userId }: Props) => {
  return (
    // drawer component
    <ControlPanel>
      <div className="overflow-y-auto py-4">
        <ul className="space-y-2">
          <li>
            <UserWebcamSelector />
          </li>
          <li>
            <UserMicrophoneSelector />
          </li>
          <li>
            <UserAudioSelector />
          </li>
        </ul>
      </div>
    </ControlPanel>
  )
}

export default SideBar
