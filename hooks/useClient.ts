import { useEffect, useState } from 'react';

type unMountFn = ()=>void

/**
 * 避免 ReactStrictMode 導致重複執行的問題
 * 適合僅在 Client Side 執行的程序。
 */
function useClient(fn: () => unMountFn, deps: any[]) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    return fn()
  }, [isMounted, ...deps])
}

export default useClient;
