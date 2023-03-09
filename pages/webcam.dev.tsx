import UserAudioSelector from '@/components/UserAudioSelector'
import UserMicrophoneSelector from '@/components/UserMicrophoneSelector'
import UserWebcamVideoButton from '@/components/UserWebcamVideoButton'
import UserAudioSpeaker from '@/components/UserAudioSpeaker'
import UserWebcamStreamBox from '@/components/UserWebcamStreamBox'
import UserWebcamAudioButton from '@/components/UserWebcamAudioButton'
import UserWebcamSelector from '@/components/UserWebcamSelector'

const WebcamePage = () => {
  console.log('WebcamePage rerender')
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
          <div className='mt-4'>
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
