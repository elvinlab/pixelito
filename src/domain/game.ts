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
  /** Optional cover image URL. Without one the card draws a label from the title and accent. */
  readonly cover?: string
  /** File name inside the emulator's `jar/` folder. Catalogue data only, never user input. */
  readonly emulatorJar: string
  /** What Pixelito's OK key sends for this game. Defaults to `enter`. */
  readonly confirmKey?: ConfirmKey
  /** Name of the game's save directory in the emulator (`/<saveDir>/rms/`). Enables saves export. */
  readonly saveDir?: string
}
