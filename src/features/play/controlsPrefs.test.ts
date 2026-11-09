// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { markHelpSeen, readHelpSeen, readPadVisible, writePadVisible } from './controlsPrefs'

const coarse = (matches: boolean) =>
  vi.stubGlobal('matchMedia', () => ({ matches }) as MediaQueryList)

afterEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('help seen', () => {
  it('starts unseen and remembers once marked', () => {
    expect(readHelpSeen()).toBe(false)
    markHelpSeen()
    expect(readHelpSeen()).toBe(true)
  })

  it('survives blocked storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(readHelpSeen()).toBe(false)
    expect(() => markHelpSeen()).not.toThrow()
  })
})

describe('on-screen keys', () => {
  it('shows by default on a touch screen', () => {
    coarse(true)
    expect(readPadVisible()).toBe(true)
  })

  it('hides by default with a mouse', () => {
    coarse(false)
    expect(readPadVisible()).toBe(false)
  })

  it('remembers the choice over the default', () => {
    coarse(false)
    writePadVisible(true)
    expect(readPadVisible()).toBe(true)
    coarse(true)
    writePadVisible(false)
    expect(readPadVisible()).toBe(false)
  })
})
