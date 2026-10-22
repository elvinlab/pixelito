import { describe, expect, it } from 'vitest'
import { parseRoute } from './router'

describe('parseRoute', () => {
  it.each(['', '#', '#/'])('treats %j as the library', (hash) => {
    expect(parseRoute(hash)).toEqual({ name: 'library' })
  })

  it('reads a play route with a game id', () => {
    expect(parseRoute('#/play/gaem')).toEqual({ name: 'play', gameId: 'gaem' })
  })

  it.each([
    '#/play/',
    '#/play/GAEM',
    '#/play/../etc',
    '#/play/gaem/extra',
    '#/play/a.jar?x=1',
    '#/nowhere',
  ])('rejects %j as not found', (hash) => {
    expect(parseRoute(hash)).toEqual({ name: 'not-found' })
  })
})
