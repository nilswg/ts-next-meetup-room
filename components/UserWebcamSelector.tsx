import { useDevicesStore } from '@/stores/devices'
import { useSidebarStore } from '@/stores/sidebar'
import { useWebcamsStore } from '@/stores/webcams'
import DevicesSelector from './DevicesSelector'
import { FaVideo } from 'react-icons/fa'

const UserWebcamSelector = () => {
  const { webcams, getWebcams, loading, error } = useWebcamsStore()
  const { setWebcamIds } = useDevicesStore()
  const {
    setWebcamOpen,
    dropdown: { webcam: open },
  } = useSidebarStore()

  return (
    <div>
      {/* {!error && <Error err={'sdfsdfd'} />} */}
      <DevicesSelector
        id={'webcam'}
        text={'視訊鏡頭'}
        devices={webcams}
        setDeviceIds={setWebcamIds}
        getDevices={getWebcams}
        isLoading={loading}
        setOpen={setWebcamOpen}
        open={open}
        Icon={FaVideo}
        error={error}
      />
    </div>
  )
}

export default UserWebcamSelector
