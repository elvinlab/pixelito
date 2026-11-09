const HELP_SEEN_KEY = 'pixelito.helpSeen'
const PAD_KEY = 'pixelito.pad'
const PANEL_KEY = 'pixelito.panel'

const store = (): Storage | undefined => {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

/** Whether the controls help has already been shown on its own once. */
export function readHelpSeen(): boolean {
  try {
    return store()?.getItem(HELP_SEEN_KEY) === '1'
  } catch {
    return false
  }
}

export function markHelpSeen(): void {
  try {
    store()?.setItem(HELP_SEEN_KEY, '1')
  } catch {
    // Blocked storage only means the help may show again.
  }
}

/** Touch screens have no keyboard, so they start with the on-screen keys; everything else starts without. */
const prefersPad = (): boolean => {
  try {
    return globalThis.matchMedia?.('(pointer: coarse)').matches ?? true
  } catch {
    return true
  }
}

/** Whether to draw Pixelito's on-screen keys: the stored choice, else by the kind of pointer. */
export function readPadVisible(): boolean {
  try {
    const saved = store()?.getItem(PAD_KEY)
    if (saved === 'on') return true
    if (saved === 'off') return false
  } catch {
    // Fall through to the default.
  }
  return prefersPad()
}

export function writePadVisible(visible: boolean): void {
  try {
    store()?.setItem(PAD_KEY, visible ? 'on' : 'off')
  } catch {
    // Blocked storage only means the choice is not remembered.
  }
}

/** Whether the side panel with the controls is open on desktop. Open until the player closes it. */
export function readPanelOpen(): boolean {
  try {
    return store()?.getItem(PANEL_KEY) !== 'off'
  } catch {
    return true
  }
}

export function writePanelOpen(open: boolean): void {
  try {
    store()?.setItem(PANEL_KEY, open ? 'on' : 'off')
  } catch {
    // Blocked storage only means the choice is not remembered.
  }
}
