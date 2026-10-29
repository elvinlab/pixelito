/** The part of `Storage` this module needs, so tests can pass a fake. */
export interface PlayedStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const keyFor = (gameId: string) => `pixelito.last-played.${gameId}`

/** The browser's storage, or nothing when it is blocked (private mode, disabled cookies). */
const browserStore = (): PlayedStore | undefined => {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

/** When the game was last played on this device, in epoch milliseconds. */
export function readLastPlayed(gameId: string, store = browserStore()): number | undefined {
  try {
    const value = Number(store?.getItem(keyFor(gameId)))
    return Number.isFinite(value) && value > 0 ? value : undefined
  } catch {
    return undefined
  }
}

/** Records that the game was played now. Never throws: the app works without storage. */
export function markPlayed(gameId: string, now = Date.now(), store = browserStore()): void {
  try {
    store?.setItem(keyFor(gameId), String(now))
  } catch {
    // Nothing to do: the library just shows the game as not played.
  }
}

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** A relative time such as "3 hours ago" or "ayer", in the given language. */
export function describeLastPlayed(timestamp: number, now: number, locale: string): string {
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const gap = Math.max(0, now - timestamp)
  if (gap < 45 * SECOND) return formatter.format(0, 'second')
  if (gap < 45 * MINUTE) return formatter.format(-Math.round(gap / MINUTE), 'minute')
  if (gap < 22 * HOUR) return formatter.format(-Math.round(gap / HOUR), 'hour')
  if (gap < 30 * DAY) return formatter.format(-Math.round(gap / DAY), 'day')
  if (gap < 365 * DAY) return formatter.format(-Math.round(gap / (30 * DAY)), 'month')
  return formatter.format(-Math.round(gap / (365 * DAY)), 'year')
}
