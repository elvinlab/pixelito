import { envelope, isTrustedSender, parseMessage } from 'pixelito-protocol'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { EMULATOR_ORIGIN } from '@/config'

/** Where the emulator is, seen from the host. */
export type EmulatorState = 'loading' | 'ready' | 'started'

/** Whether a key goes down or comes up. */
export type KeyAction = 'down' | 'up'

/** What a screen gets from the bridge. */
export interface EmulatorBridge {
  readonly state: EmulatorState
  /** Sends a key to the emulator. Ignored until the emulator says `ready`. */
  readonly sendKey: (action: KeyAction, code: string) => void
}

/**
 * Talks to the emulator iframe with the Pixelito protocol.
 *
 * Sends `hello` when the frame loads, accepts only messages from the emulator
 * origin and window, and validates each one before using it.
 */
export function useEmulatorBridge(frameRef: RefObject<HTMLIFrameElement | null>): EmulatorBridge {
  const [state, setState] = useState<EmulatorState>('loading')
  const stateRef = useRef(state)
  stateRef.current = state

  const sendKey = useCallback(
    (action: KeyAction, code: string) => {
      if (stateRef.current === 'loading') return
      frameRef.current?.contentWindow?.postMessage(
        envelope({ type: 'key', action, code }),
        EMULATOR_ORIGIN,
      )
    },
    [frameRef],
  )

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const hello = () =>
      frame.contentWindow?.postMessage(envelope({ type: 'hello' }), EMULATOR_ORIGIN)

    const onMessage = (event: MessageEvent) => {
      if (!isTrustedSender(event, [EMULATOR_ORIGIN], frame.contentWindow)) return
      const result = parseMessage(event.data, 'emulator-to-host')
      if (!result.ok) return
      if (result.message.type === 'ready') setState((s) => (s === 'started' ? s : 'ready'))
      if (result.message.type === 'started') setState('started')
    }

    window.addEventListener('message', onMessage)
    frame.addEventListener('load', hello)
    return () => {
      window.removeEventListener('message', onMessage)
      frame.removeEventListener('load', hello)
    }
  }, [frameRef])

  return { state, sendKey }
}
