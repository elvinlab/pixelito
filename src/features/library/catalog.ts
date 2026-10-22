import type { Game } from '@/domain/game'

/** Games Pixelito offers. Only freely licensed games belong here (see ADR 0001). */
export const CATALOG: readonly Game[] = [
  {
    id: 'gaem',
    title: 'GAEM',
    compatibility: 'playable',
    accent: '#22d3ee',
    emulatorJar: 'gaem.jar',
  },
]

/** Finds a catalogue game by id. */
export function findGame(id: string): Game | undefined {
  return CATALOG.find((game) => game.id === id)
}
