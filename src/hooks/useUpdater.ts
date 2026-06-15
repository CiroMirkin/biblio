import { useState, useEffect, useCallback } from 'react'

type UpdaterState = 'idle' | 'available' | 'downloading' | 'ready'

export function useUpdater() {
  const [state, setState] = useState<UpdaterState>('idle')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updater = (window as any).updater
    if (!updater) return

    updater.onAvailable(() => setState('available'))
    updater.onProgress((percent: number) => {
      setState('downloading')
      setProgress(Math.round(percent))
    })
    updater.onDownloaded(() => setState('ready'))
  }, [])

  const download = useCallback(() => {
    const updater = (window as any).updater
    if (updater) updater.download()
  }, [])

  const install = useCallback(() => {
    const updater = (window as any).updater
    if (updater) updater.install()
  }, [])

  return { state, progress, download, install } as const
}
