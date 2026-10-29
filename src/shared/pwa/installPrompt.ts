import { useCallback, useSyncExternalStore } from 'react'

/** The non-standard event Chromium fires when the app can be installed. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  readonly userChoice: Promise<{ readonly outcome: 'accepted' | 'dismissed' }>
}

// The event can fire before React mounts, so it is captured at module load.
let deferred: BeforeInstallPromptEvent | undefined
const listeners = new Set<() => void>()

const setDeferred = (next: BeforeInstallPromptEvent | undefined) => {
  deferred = next
  for (const listener of listeners) listener()
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Hold the browser's own mini-infobar back so the app can offer install in its own place.
    event.preventDefault()
    setDeferred(event as BeforeInstallPromptEvent)
  })
  window.addEventListener('appinstalled', () => setDeferred(undefined))
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
const snapshot = () => deferred

/** Whether the browser offers to install the app, and the action that shows its prompt. */
export function useInstallPrompt(): {
  readonly canInstall: boolean
  readonly install: () => Promise<void>
} {
  const event = useSyncExternalStore(subscribe, snapshot, () => undefined)
  const install = useCallback(async () => {
    if (!event) return
    await event.prompt()
    // The prompt can only be used once, whatever the player chose.
    setDeferred(undefined)
  }, [event])
  return { canInstall: event !== undefined, install }
}
