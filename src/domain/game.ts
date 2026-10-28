/** How well a game is known to run. Only a human grants `playable`. */
export type CompatibilityStatus = 'playable' | 'partial' | 'does-not-run' | 'untested'

/** The key a game expects for "accept". Most use Enter; some only react to 5. */
export type ConfirmKey = 'enter' | 'five'

/** A game in the catalogue. */
export interface Game {
  /** Stable id used in URLs: lowercase letters, digits and dashes. */
  readonly id: string
  readonly title: string
  readonly compatibility: CompatibilityStatus
  /** The game's own accent color, shown on its card. */
  readonly accent: string
  /** File name inside the emulator's `jar/` folder. Catalogue data only, never user input. */
  readonly emulatorJar: string
  /** What Pixelito's OK key sends for this game. Defaults to `enter`. */
  readonly confirmKey?: ConfirmKey
}
