import { useCallback, useSyncExternalStore } from 'react'

export const THEMES = ['night', 'dmg', 'light'] as const
export type Theme = (typeof THEMES)[number]

export const DEFAULT_THEME: Theme = 'night'

const STORAGE_KEY = 'pixelito.theme'

/** The browser chrome colour (address bar, task switcher) that goes with each theme. */
const CHROME_COLOR: Record<Theme, string> = {
  night: '#07070f',
  dmg: '#0b1f0b',
  light: '#f4f1ff',
}

export const parseTheme = (value: unknown): Theme | undefined =>
  THEMES.find((theme) => theme === value)

/** The part of `Storage` this module needs, so tests can pass a fake. */
interface ThemeStore {
  getItem(key: string): string | null
  setItem?(key: string, value: string): void
}

const browserStore = (): ThemeStore | undefined => {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

/** The stored theme, or the default when nothing valid is stored or storage is blocked. */
export function readTheme(store = browserStore()): Theme {
  try {
    return parseTheme(store?.getItem(STORAGE_KEY)) ?? DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

/** Puts a theme on the page: the `data-theme` attribute and the browser chrome colour. */
export function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', CHROME_COLOR[theme])
}

let current: Theme = readTheme()
applyTheme(current)

const listeners = new Set<() => void>()
const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function set(theme: Theme): void {
  current = theme
  applyTheme(theme)
  try {
    browserStore()?.setItem?.(STORAGE_KEY, theme)
  } catch {
    // The theme still applies for this visit without storage.
  }
  for (const listener of listeners) listener()
}

/** The active theme and the action that changes it. */
export function useTheme(): { readonly theme: Theme; readonly setTheme: (theme: Theme) => void } {
  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => DEFAULT_THEME,
  )
  return { theme, setTheme: useCallback(set, []) }
}
