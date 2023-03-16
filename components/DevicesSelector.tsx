import { CSSProperties, useCallback, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { CgSpinner, CgChevronDown } from 'react-icons/cg'

export type DevicesSelectorProps = {
  id: string
  devices: Array<DeviceProps>
  setDeviceIds: (ids: { id: string; groupId: string }) => void
  getDevices: () => Promise<void>
  text: string
  isLoading: boolean
  open: boolean
  setOpen: (open: boolean) => void
  Icon: IconType
  error: string
}

const DevicesSelector = ({
  id,
  devices,
  setDeviceIds,
  getDevices,
  text = '選擇設備',
  isLoading = false,
  open,
  setOpen,
  Icon,
  error,
}: DevicesSelectorProps) => {
  const [loading, setLoading] = useState(isLoading)

  const setSelectCallback = useCallback((device: DeviceProps) => {
    console.log('change device\n', { device })
    setDeviceIds({ id: device.id, groupId: device.groupId })
  }, [])

  const handleOpen = () => {
    if (loading) return

    if (open) {
      setOpen(false)
      return
    }

    setLoading(true)

    // setTimeout(async () => {
    getDevices().then(() => {
      setLoading(false)
      setOpen(true)
    })
    // }, 300)
  }

  return (
    <>
      <button
        id={'selector_' + id}
        type="button"
        className="group flex w-full items-center rounded-lg p-2 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
        onClick={handleOpen}
      >
        <Icon className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
        <span className="ml-3 flex-1 whitespace-nowrap text-left">{text}</span>
        {loading ? (
          <span className="ml-1 inline-flex items-center justify-center">
            <CgSpinner className={`h-5 w-5 animate-[spin_1s_linear_infinite] `} />
          </span>
        ) : (
          <span className="ml-1 inline-flex items-center justify-center">
            <CgChevronDown className="h-5 w-5" />
          </span>
        )}
      </button>
      <ul className={`${open ? '' : 'hidden'} space-y-2 py-2`}>
        {!!error && <Error err={error} />}
        {!loading &&
          (!devices.length ? (
            <li>
              <Item
                device={{
                  id: '',
                  groupId: '',
                  kind: 'audioinput',
                  label: '沒有設備',
                }}
                setSelect={() => {}}
              />
            </li>
          ) : (
            <>
              {devices.map((device, i) => (
                <li key={device.id + i}>
                  <Item device={device} setSelect={setSelectCallback} />
                </li>
              ))}
            </>
          ))}
      </ul>
    </>
  )
}

type ItemProps = {
  device: DeviceProps
  setSelect: (device: DeviceProps) => void
}

function Item({ device, setSelect }: ItemProps) {
  const onClick = () => setSelect({ ...device })
  return (
    <p
      className={`group flex w-full items-center rounded-lg p-2 pl-11 text-base font-normal text-gray-900 transition duration-75 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700`}
      onClick={onClick}
    >
      {/* {`${device.id.slice(0, 10)} | ${device.label}`} */}
      {device.label}
    </p>
  )
}

function Error({ err }: { err: string }) {
  return (
    <li className="flex h-full w-full items-center">
      <p
        id="standard_error"
        className={`group flex w-full items-center rounded-lg border border-red-500  p-2 pl-11 text-base font-normal text-red-600 transition duration-75 dark:text-red-500`}
      >
        Error: {err}
      </p>
    </li>
  )
}

export default DevicesSelector
