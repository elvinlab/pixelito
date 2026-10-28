import { envelope, isTrustedSender, parseMessage, type SaveBlob } from 'pixelito-protocol'
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
  /** Whether the emulator can export saves. Known after `ready`. */
  readonly canExportSaves: boolean
  /** Asks the emulator for one game's saves. Rejects on a `save-failed` error or after a timeout. */
  readonly exportSaves: (gameId: string, app: string) => Promise<readonly SaveBlob[]>
}

const EXPORT_TIMEOUT_MS = 10_000

interface PendingExport {
  readonly gameId: string
  readonly resolve: (files: readonly SaveBlob[]) => void
  readonly reject: (error: Error) => void
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
  const [canExportSaves, setCanExportSaves] = useState(false)
  const pendingRef = useRef<PendingExport | null>(null)

  const exportSaves = useCallback(
    (gameId: string, app: string) =>
      new Promise<readonly SaveBlob[]>((resolve, reject) => {
        const win = frameRef.current?.contentWindow
        if (!win || pendingRef.current) return reject(new Error('export unavailable'))
        const done = () => {
          clearTimeout(timer)
          pendingRef.current = null
        }
        const timer = setTimeout(() => {
          done()
          reject(new Error('export timed out'))
        }, EXPORT_TIMEOUT_MS)
        pendingRef.current = {
          gameId,
          resolve: (files) => {
            done()
            resolve(files)
          },
          reject: (error) => {
            done()
            reject(error)
          },
        }
        win.postMessage(envelope({ type: 'export-save', id: gameId, app }), EMULATOR_ORIGIN)
      }),
    [frameRef],
  )

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
      const message = result.message
      if (message.type === 'ready') {
        setState((s) => (s === 'started' ? s : 'ready'))
        setCanExportSaves(message.capabilities.includes('saves-export'))
      }
      if (message.type === 'started') setState('started')
      const pending = pendingRef.current
      if (message.type === 'save-data' && pending?.gameId === message.id)
        pending.resolve(message.files)
      if (message.type === 'error' && message.code === 'save-failed') {
        pending?.reject(new Error('save-failed'))
      }
    }

    window.addEventListener('message', onMessage)
    frame.addEventListener('load', hello)
    return () => {
      window.removeEventListener('message', onMessage)
      frame.removeEventListener('load', hello)
    }
  }, [frameRef])

  return { state, sendKey, canExportSaves, exportSaves }
}
