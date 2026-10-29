import { describe, expect, it } from 'vitest'
import { initials } from './initials'

describe('initials', () => {
  it('takes the first letter of up to three words', () => {
    expect(initials('Rally Master Pro')).toBe('RMP')
    expect(initials('The Legend of Zelda')).toBe('TLO')
  })

  it('splits on dashes and ignores punctuation', () => {
    expect(initials('Pac-Man')).toBe('PM')
    expect(initials('  Space  Impact!  ')).toBe('SI')
  })

  it('keeps up to four letters of a single word', () => {
    expect(initials('GAEM')).toBe('GAEM')
    expect(initials('Kakuro')).toBe('KAKU')
  })

  it('falls back to a question mark when there is nothing usable', () => {
    expect(initials('')).toBe('?')
    expect(initials('!!!')).toBe('?')
  })
})
