import { describe, expect, it } from 'vitest'
import { isForwardedKey, keyForGame } from './keys'

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
  it.each(['KeyA', 'F5', 'Digit10', 'constructor', '', 'Tab'])('keeps %s for the browser', (code) =>
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
