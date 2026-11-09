import { describe, expect, it } from 'vitest'
import { canonicalKey, isForwardedKey, keyForGame } from './keys'

describe('isForwardedKey', () => {
  it.each([
    'Enter',
    'ArrowUp',
    'F1',
    'F2',
    'Escape',
    'Digit0',
    'Digit9',
    'NumpadMultiply',
    'NumpadDivide',
  ])('forwards %s', (code) => expect(isForwardedKey(code)).toBe(true))
  it.each(['KeyB', 'F5', 'Digit10', 'constructor', '', 'Tab'])('keeps %s for the browser', (code) =>
    expect(isForwardedKey(code)).toBe(false),
  )
})

describe('keyForGame', () => {
  it('sends Enter for OK when the game confirms with Enter', () => {
    expect(keyForGame('Enter', 'enter')).toBe('Enter')
  })

  it('sends 5 for OK when the game confirms with 5', () => {
    expect(keyForGame('Enter', 'five')).toBe('Digit5')
  })

  it.each(['Digit5', 'ArrowUp', 'F1', 'Escape'])('leaves %s as it is', (code) => {
    expect(keyForGame(code, 'five')).toBe(code)
    expect(keyForGame(code, 'enter')).toBe(code)
  })
})

describe('canonicalKey', () => {
  it.each([
    ['KeyZ', 'F1'],
    ['KeyX', 'F2'],
    ['Space', 'Enter'],
    ['KeyW', 'ArrowUp'],
    ['KeyA', 'ArrowLeft'],
    ['KeyS', 'ArrowDown'],
    ['KeyD', 'ArrowRight'],
  ])('maps %s to %s', (code, expected) => expect(canonicalKey(code)).toBe(expected))

  it.each(['Enter', 'ArrowUp', 'F1', 'Digit7'])('keeps %s as it is', (code) =>
    expect(canonicalKey(code)).toBe(code),
  )

  it.each(['KeyB', 'Tab', 'constructor', ''])('has no key for %s', (code) =>
    expect(canonicalKey(code)).toBeUndefined(),
  )
})
