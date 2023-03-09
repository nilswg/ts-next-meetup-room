import { useDevicesStore } from '@/stores/devices'
import { useMicrophonesStore } from '@/stores/microphones'
import { useSidebarStore } from '@/stores/sidebar';
import { FaMicrophone } from 'react-icons/fa';
import DevicesSelector from './DevicesSelector'

const UserMicrophoneSelector = () => {
  const { microphones, getMicrophones, loading, error } = useMicrophonesStore()
  const { setMicrophoneIds } = useDevicesStore()
  const {
    setMicrophoneOpen,
    dropdown: { microphone: open },
  } = useSidebarStore()

  return (
    <div>
      <DevicesSelector
        id={'microphone'}
        text={'麥克風'}
        devices={microphones}
        setDeviceIds={setMicrophoneIds}
        getDevices={getMicrophones}
        isLoading={loading}
        setOpen={setMicrophoneOpen}
        open={open}
        Icon={FaMicrophone}
        error={error}
      />
    </div>
  )
}

export default UserMicrophoneSelector
