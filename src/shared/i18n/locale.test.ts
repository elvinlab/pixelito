import { describe, expect, it } from 'vitest'
import { detectLocale } from './locale'

describe('detectLocale', () => {
  it('uses a saved choice before anything else', () => {
    expect(detectLocale('en', ['es-CR'])).toBe('en')
    expect(detectLocale('es', ['en-US'])).toBe('es')
  })

  it('ignores a saved value that is not a known language', () => {
    expect(detectLocale('fr', ['en-US'])).toBe('en')
    expect(detectLocale('', ['es'])).toBe('es')
  })

  it('picks English when the browser prefers it', () => {
    expect(detectLocale(null, ['en-US', 'es'])).toBe('en')
    expect(detectLocale(null, ['en'])).toBe('en')
  })

  it('defaults to Spanish for Spanish, other languages or nothing', () => {
    expect(detectLocale(null, ['es-CR'])).toBe('es')
    expect(detectLocale(null, ['fr-FR'])).toBe('es')
    expect(detectLocale(null, [])).toBe('es')
  })

  it('does not mistake a language that merely starts with "en"', () => {
    expect(detectLocale(null, ['eng'])).toBe('es')
  })
})
