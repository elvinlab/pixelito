import { useRef } from 'react'
import { EMULATOR_ORIGIN } from '@/config'
import { useEmulatorBridge } from './useEmulatorBridge'

interface EmulatorFrameProps {
  /** File name of a game inside the emulator's `jar/` folder. Never pass user input here. */
  readonly jar: string
}

const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches

/**
 * Embeds the emulator for one game. The emulator's `jar` parameter is not sanitized upstream.
 * On touch devices it also asks for the emulator's own on-screen keypad (`mobile=1`).
 */
export function EmulatorFrame({ jar }: EmulatorFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  const state = useEmulatorBridge(frameRef)
  const mobile = isTouchDevice() ? '&mobile=1' : ''
  const src = `${EMULATOR_ORIGIN}/run.html?jar=${encodeURIComponent(jar)}${mobile}`
  return (
    <iframe
      ref={frameRef}
      data-emulator-state={state}
      title="Game"
      src={src}
      allow="autoplay; fullscreen"
      style={{ width: '100%', height: '70dvh', border: 0, background: '#000' }}
    />
  )
}
