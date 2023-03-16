import Image from 'next/image'
import { useState } from 'react'
import test from '/public/test.jpg'
import useClient from '@/hooks/useClient'
import MeetLayout from '@/components/MeetLayout'

const MeetLayoutPage = () => {
  const [webcams, setWebcams] = useState<number[]>([0])
  const [screens, setScreens] = useState<number[]>([])
  const [fill, setFill] = useState(false)

  useClient(() => {
    const resize = () => {
      const _fill = window.innerWidth < 1024
      console.log('fill', _fill)
      setFill(_fill)
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <MeetLayout
      debug={true}
      roomId={'RoomId'}
      userId={'UserId'}
      webcams={webcams}
      setWebcams={setWebcams}
      screens={screens}
      setScreens={setScreens}
      ScreenComp={screens.map((x, i) => (
        <div key={`screen_${i}`} className="relative flex h-full items-center justify-center bg-pink-500">
          <div className="absolute top-2 right-4 text-white">Top Right</div>
          <Image src={test} alt="" fill className="object-contain" />
        </div>
      ))}
      WebcamCompHasScreen={webcams.map((x, i) => (
        <div key={`webcam_${i}`} className="relative flex w-full items-center justify-center bg-sky-700">
          <div className="relative w-full max-w-[400px]">
            <div className="absolute top-2 right-4 text-white">Top Right</div>
            <Image src={test} alt="" fill={fill} className="object-contain" />
          </div>
        </div>
      ))}
      WebcamCompNoScreen={webcams.map((x, i) => (
        <div key={`webcam_${i}`} className="relative flex justify-center bg-pink-500">
          <div className="absolute top-2 right-4 text-white">Top Right</div>
          <Image src={test} alt="" className="object-contain" />
        </div>
      ))}
    ></MeetLayout>
  )
}

export default MeetLayoutPage
