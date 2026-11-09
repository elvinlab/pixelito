// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { applyTheme, DEFAULT_THEME, parseTheme, readTheme, useTheme } from './theme'

describe('parseTheme', () => {
  it('accepts the known themes and rejects anything else', () => {
    expect(parseTheme('dmg')).toBe('dmg')
    expect(parseTheme('light')).toBe('light')
    expect(parseTheme('neon')).toBeUndefined()
    expect(parseTheme(null)).toBeUndefined()
  })
})

describe('readTheme', () => {
  beforeEach(() => localStorage.clear())

  it('falls back to the default when nothing valid is stored', () => {
    expect(readTheme()).toBe(DEFAULT_THEME)
    localStorage.setItem('pixelito.theme', 'neon')
    expect(readTheme()).toBe(DEFAULT_THEME)
  })

  it('reads the stored theme', () => {
    localStorage.setItem('pixelito.theme', 'light')
    expect(readTheme()).toBe('light')
  })

  it('falls back when storage is blocked', () => {
    const store = {
      getItem: () => {
        throw new Error('blocked')
      },
    }
    expect(readTheme(store)).toBe(DEFAULT_THEME)
  })
})

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.head.innerHTML = '<meta name="theme-color" content="#000000">'
    applyTheme(DEFAULT_THEME)
  })
  afterEach(cleanup)

  it('applies a chosen theme to the page, the browser chrome and storage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setTheme('dmg'))
    expect(result.current.theme).toBe('dmg')
    expect(document.documentElement.dataset.theme).toBe('dmg')
    expect(localStorage.getItem('pixelito.theme')).toBe('dmg')
    expect(document.querySelector('meta[name="theme-color"]')?.getAttribute('content')).not.toBe(
      '#000000',
    )
  })
})
