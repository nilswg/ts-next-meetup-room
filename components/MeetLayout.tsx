import SideBar, { Button as SideBarButton } from '@/components/SideBar'
import UserEnterRoomButton from '@/components/UserEnterRoomButton'
import UserScreenShareButton from '@/components/UserScreenShareButton'
import UserWebcamAudioButton from '@/components/UserWebcamAudioButton'
import UserWebcamVideoButton from '@/components/UserWebcamVideoButton'
import React, { useMemo, useState } from 'react'
import { SlCamera, SlScreenDesktop } from 'react-icons/sl'

type Props = {
  debug?: boolean
  userId: string
  roomId: string
  webcams: any[]
  setWebcams: (webcams: any[]) => void
  screens: any[]
  setScreens: (screens: any[]) => void
  ScreenComp: React.ReactNode
  WebcamCompHasScreen: React.ReactNode
  WebcamCompNoScreen: React.ReactNode
}

const MeetLayout = ({
  debug = false,
  userId = 'UserId',
  roomId = 'RoomId',
  webcams,
  setWebcams,
  screens,
  setScreens,
  WebcamCompHasScreen,
  WebcamCompNoScreen,
  ScreenComp,
}: Props) => {
  const numOfWebcams = useMemo(() => webcams.length, [webcams])
  const hasScreen = useMemo(() => screens.length > 0, [screens])

  const onNumOfWebcamsChange = (num: number) => {
    console.log('numOfWebcams', num)
    let arr = []
    for (let i = 0; i < num; i++) {
      arr.push(0)
    }
    console.log(arr)
    setWebcams(arr)
  }

  const onNumOfScreensChange = (num: number) => {
    console.log('numOfScreens', num)
    let arr = []
    for (let i = 0; i < num; i++) {
      arr.push(0)
    }
    console.log(arr)
    setScreens(arr)
  }

  const hasWebcam = webcams.length > 0
  const screenHeight = hasWebcam ? /*tw:*/ 'h-[calc(100vh-8.3rem-300px)]' : /*tw:*/ 'h-[calc(100vh-8.3rem)]'
  const screenWidth = hasWebcam ? /*tw:*/ 'lg:w-[calc(100vw-20.4rem)]' : /*tw:*/ 'lg:w-full'

  // const styles = hasWebcam
  //   ? {
  //       screensGridHeight: 'h-[calc(100vh-8.3rem-300px)]',
  //       screensGridWidth: 'lg:w-[calc(100vw-20.4rem)]',
  //       webcamsGridHeight: 'lg:w-[20.4rem]',
  //       webcamHeight: 'h-[300px]',
  //     }
  //   : {
  //       screensGridHeight: 'h-[calc(100vh-8.3rem)]',
  //       screensGridWidth: 'lg:w-full',
  //       webcamsGridHeight: '',
  //       webcamHeight: '',
  //     }

  return (
    <>
      {/* drawer button */}
      <SideBar roomId={roomId as string} userId={userId} />
      <div className="relative flex flex-col items-center justify-center bg-none lg:flex-row">
        {/* 左上控制面板 */}
        <div className="absolute left-0 top-0 z-10 flex flex-col items-start justify-center gap-6">
          <SideBarButton />
          {debug && (
            <div className="m-3 text-neutral-300">
              <div className="flex items-center gap-2">
                <SlScreenDesktop className="h-6 w-6" /> : {screens.length}
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-600 text-lg text-white"
                  onClick={() => onNumOfScreensChange(screens.length + 1)}
                >
                  +
                </button>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-600 text-lg text-white"
                  onClick={() => onNumOfScreensChange(screens.length - 1)}
                >
                  -
                </button>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <SlCamera className="h-6 w-6" /> : {webcams.length}
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-600 text-lg text-white"
                  onClick={() => onNumOfWebcamsChange(webcams.length + 1)}
                >
                  +
                </button>
                <button
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-600 text-lg text-white"
                  onClick={() => onNumOfWebcamsChange(webcams.length - 1)}
                >
                  -
                </button>
              </div>
            </div>
          )}
        </div>

        {hasScreen ? (
          <>
            <div className={`${screenHeight} w-full overflow-auto bg-none lg:h-[calc(100vh-8.3rem)] ${screenWidth}`}>
              {/* {screens.map((x, i) => (
                <div key={`screen_${i}`} className="relative flex h-full items-center justify-center bg-pink-500">
                  <Image src={test} alt="" fill className="object-contain" />
                </div>
              ))} */}
              {ScreenComp}
            </div>
            {hasWebcam && (
              <div className="w-full lg:w-[20.4rem]">
                <div
                  className={`grid h-[300px] w-[100vw] grid-cols-[repeat(${numOfWebcams},_minmax(300px,_1fr))] overflow-x-auto overflow-y-auto lg:flex lg:h-[calc(100vh-8.3rem)] lg:w-auto lg:flex-col lg:overflow-y-auto`}
                >
                  {/* {webcams.map((x, i) => (
                    <div key={`webcam_${i}`} className="relative flex items-center justify-center bg-sky-700">
                      <Image src={test} alt="" fill={fill} className="object-contain" />
                    </div>
                  ))} */}
                  {WebcamCompHasScreen}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="h-[calc(100vh-8.3rem)] w-full overflow-y-auto overflow-x-hidden bg-none">
            <div
              className={`grid h-full grid-cols-[repeat(auto-fill,_minmax(330px,_1fr))] sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/${numOfWebcams})),_1fr))]`}
            >
              {/* {webcams.map((x, i) => (
                <div key={`webcam_${i}`} className="relative flex justify-center bg-pink-500">
                  <Image src={test} alt="" fill={false} className="object-contain" />
                </div>
              ))} */}
              {WebcamCompNoScreen}
            </div>
          </div>
        )}
      </div>

      {/* 下方視訊控制按鈕 */}
      <div className="flex justify-center">
        <div className="flex w-full max-w-[400px] flex-row items-center justify-center gap-2 rounded-t-full bg-neutral-200 pt-2 pb-3 dark:bg-neutral-600">
          <UserWebcamVideoButton />
          <UserWebcamAudioButton />
          <UserScreenShareButton roomId={roomId as string} userId={userId} />
          <UserEnterRoomButton roomId={roomId as string} userId={userId} />
        </div>
      </div>
    </>
  )
}

export default MeetLayout

/**
 * safelist (目前最多10人)
 *
 * grid-cols-[repeat(1,_minmax(300px,_1fr))]
 * grid-cols-[repeat(2,_minmax(300px,_1fr))]
 * grid-cols-[repeat(3,_minmax(300px,_1fr))]
 * grid-cols-[repeat(4,_minmax(300px,_1fr))]
 * grid-cols-[repeat(5,_minmax(300px,_1fr))]
 * grid-cols-[repeat(6,_minmax(300px,_1fr))]
 * grid-cols-[repeat(7,_minmax(300px,_1fr))]
 * grid-cols-[repeat(8,_minmax(300px,_1fr))]
 * grid-cols-[repeat(9,_minmax(300px,_1fr))]
 * grid-cols-[repeat(10,_minmax(300px,_1fr))]
 *
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/1)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/2)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/3)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/4)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/5)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/6)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/7)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/8)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/9)),_1fr))]
 * sm:grid-cols-[repeat(auto-fill,_minmax(max(300px,calc(100vw/10)),_1fr))]
 *
 *
 */
