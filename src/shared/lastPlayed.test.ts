import { describe, expect, it } from 'vitest'
import { describeLastPlayed, markPlayed, readLastPlayed } from './lastPlayed'

const memoryStore = () => {
  const data = new Map<string, string>()
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  }
}

describe('last played storage', () => {
  it('returns nothing for a game that was never played', () => {
    expect(readLastPlayed('gaem', memoryStore())).toBeUndefined()
  })

  it('remembers when each game was played, separately', () => {
    const store = memoryStore()
    markPlayed('gaem', 1000, store)
    markPlayed('other', 2000, store)
    expect(readLastPlayed('gaem', store)).toBe(1000)
    expect(readLastPlayed('other', store)).toBe(2000)
  })

  it('ignores a stored value that is not a number', () => {
    const store = memoryStore()
    store.setItem('pixelito.last-played.gaem', 'garbage')
    expect(readLastPlayed('gaem', store)).toBeUndefined()
  })

  it('does not throw when storage is unavailable or refuses writes', () => {
    const broken = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
    }
    expect(() => markPlayed('gaem', 1, broken)).not.toThrow()
    expect(readLastPlayed('gaem', broken)).toBeUndefined()
    expect(() => markPlayed('gaem', 1, undefined)).not.toThrow()
    expect(readLastPlayed('gaem', undefined)).toBeUndefined()
  })
})

describe('describeLastPlayed', () => {
  const now = Date.UTC(2026, 9, 28, 12, 0, 0)
  const ago = (ms: number) => now - ms
  const MIN = 60_000
  const HOUR = 60 * MIN
  const DAY = 24 * HOUR

  it('says "now" for the last seconds', () => {
    expect(describeLastPlayed(ago(10_000), now, 'en')).toBe('now')
    expect(describeLastPlayed(ago(10_000), now, 'es')).toBe('ahora')
  })

  it('uses minutes, hours, days and months as the gap grows', () => {
    expect(describeLastPlayed(ago(5 * MIN), now, 'en')).toBe('5 minutes ago')
    expect(describeLastPlayed(ago(3 * HOUR), now, 'en')).toBe('3 hours ago')
    expect(describeLastPlayed(ago(DAY), now, 'en')).toBe('yesterday')
    expect(describeLastPlayed(ago(3 * DAY), now, 'en')).toBe('3 days ago')
    expect(describeLastPlayed(ago(70 * DAY), now, 'en')).toBe('2 months ago')
  })

  it('follows the selected language', () => {
    expect(describeLastPlayed(ago(DAY), now, 'es')).toBe('ayer')
    expect(describeLastPlayed(ago(3 * HOUR), now, 'es')).toBe('hace 3 horas')
  })

  it('treats a timestamp from the future as now', () => {
    expect(describeLastPlayed(now + HOUR, now, 'en')).toBe('now')
  })
})
