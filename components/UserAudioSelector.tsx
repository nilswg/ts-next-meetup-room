import { useAudiosStore } from '@/stores/audios'
import { useDevicesStore } from '@/stores/devices'
import { useSidebarStore } from '@/stores/sidebar'
import { FaVolumeDown } from 'react-icons/fa'
import DevicesSelector from './DevicesSelector'

const UserAudioSelector = () => {
  const { audios, getAudios, loading, error } = useAudiosStore()
  const { setAudioIds } = useDevicesStore()
  const {
    setAduioOpen,
    dropdown: { audio: open },
  } = useSidebarStore()

  return (
    <div>
      {/* {!error && <Error err={'sdfsdfd'} />} */}
      <DevicesSelector
        id={'audio'}
        text={'輸出音效'}
        devices={audios}
        setDeviceIds={setAudioIds}
        getDevices={getAudios}
        isLoading={loading}
        setOpen={setAduioOpen}
        open={open}
        Icon={FaVolumeDown}
        error={error}
      />
    </div>
  )
}

export default UserAudioSelector
