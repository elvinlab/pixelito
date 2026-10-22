import { describe, expect, it } from 'vitest'
import { isForwardedKey } from './keys'

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
