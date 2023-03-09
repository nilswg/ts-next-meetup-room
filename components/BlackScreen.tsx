import { useSidebarStore } from '@/stores/sidebar'

const BlackScreen = () => {
  const { open, setOpen } = useSidebarStore()

  return (
    <div
      onClick={()=>setOpen(false)}
      className={`fixed inset-0 z-30 ${open ? '' : 'hidden'} bg-gray-900 bg-opacity-50 dark:bg-opacity-80`}
    />
  )
}

export default BlackScreen
