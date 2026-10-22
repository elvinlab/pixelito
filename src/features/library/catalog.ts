import type { Game } from '@/domain/game'

/** Games Pixelito offers. Only freely licensed games belong here (see ADR 0001). */
const OFFICIAL_CATALOG: readonly Game[] = [
  {
    id: 'gaem',
    title: 'GAEM',
    compatibility: 'playable',
    accent: '#22d3ee',
    emulatorJar: 'gaem.jar',
  },
]

/**
 * Games only on this machine, from the git-ignored `catalog.local.ts` (same shape:
 * `export const LOCAL_GAMES: readonly Game[]`). For trying your own `.jar` files
 * during development; never commit commercial games.
 */
const localModules = import.meta.glob<{ LOCAL_GAMES: readonly Game[] }>('./catalog.local.ts', {
  eager: true,
})
const LOCAL_CATALOG = Object.values(localModules).flatMap((module) => module.LOCAL_GAMES)

/** Every game shown in the library. */
export const CATALOG: readonly Game[] = [...OFFICIAL_CATALOG, ...LOCAL_CATALOG]

/** Finds a catalogue game by id. */
export function findGame(id: string): Game | undefined {
  return CATALOG.find((game) => game.id === id)
}
