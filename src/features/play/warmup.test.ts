import { describe, expect, it } from 'vitest'
import { shouldWarmUp } from './warmup'

describe('shouldWarmUp', () => {
  it('warms up when nothing says the connection is limited', () => {
    expect(shouldWarmUp(undefined)).toBe(true)
    expect(shouldWarmUp({})).toBe(true)
  })

  it('warms up on a fast connection', () => {
    expect(shouldWarmUp({ effectiveType: '4g' })).toBe(true)
  })

  it('does not warm up when the player asked to save data', () => {
    expect(shouldWarmUp({ saveData: true, effectiveType: '4g' })).toBe(false)
  })

  it.each(['slow-2g', '2g', '3g'])('does not warm up on a %s connection', (effectiveType) => {
    expect(shouldWarmUp({ effectiveType })).toBe(false)
  })
})
