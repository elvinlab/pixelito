import { useEffect, useState } from 'react'
import { EMULATOR_ORIGIN, EMULATOR_URL } from '@/config'
import { type ConnectionInfo, shouldWarmUp } from './warmup'

const IDLE_FALLBACK_MS = 1500
const GIVE_UP_MS = 60_000

const connectionInfo = (): ConnectionInfo | undefined =>
  (navigator as Navigator & { connection?: ConnectionInfo }).connection

/**
 * Downloads the emulator runtime in a hidden frame while the player browses the
 * library, so the first game starts sooner. The frame runs no game and removes
 * itself when the emulator says it is done.
 */
export function EmulatorWarmup() {
  const [warming, setWarming] = useState(false)

  useEffect(() => {
    if (!shouldWarmUp(connectionInfo())) return
    const start = () => setWarming(true)
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: IDLE_FALLBACK_MS })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(start, IDLE_FALLBACK_MS)
    return () => window.clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!warming) return
    const onMessage = (event: MessageEvent) => {
      if (event.origin === EMULATOR_ORIGIN && event.data?.pixelitoWarmup === 'done') {
        setWarming(false)
      }
    }
    window.addEventListener('message', onMessage)
    const giveUp = window.setTimeout(() => setWarming(false), GIVE_UP_MS)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(giveUp)
    }
  }, [warming])

  if (!warming) return null
  return (
    <iframe
      hidden
      tabIndex={-1}
      title="Emulator warm-up"
      src={`${EMULATOR_URL}/run.html?warmup=1`}
    />
  )
}
