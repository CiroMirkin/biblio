import { useState, useEffect, useCallback } from 'react'

type UpdaterState = 'idle' | 'available' | 'downloading' | 'ready' | 'error'

export function useUpdater() {
  const [state, setState] = useState<UpdaterState>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updater = (window as any).updater
    if (!updater) return

    const cleanups = [
      updater.onAvailable(() => { setState('available'); setError(null) }),
      updater.onProgress((percent: number) => { setState('downloading'); setProgress(Math.round(percent)); setError(null) }),
      updater.onDownloaded(() => { setState('ready'); setError(null) }),
      updater.onError((message: string) => { setState('error'); setError(message) }),
    ]

    return () => cleanups.forEach((fn: () => void) => fn())
  }, [])

  const download = useCallback(() => {
    const updater = (window as any).updater
    if (updater) updater.download()
  }, [])

  const install = useCallback(() => {
    const updater = (window as any).updater
    if (updater) updater.install()
  }, [])

  return { state, progress, error, download, install } as const
}
