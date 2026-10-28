/** The part of the browser's Network Information API that Pixelito reads. */
export interface ConnectionInfo {
  readonly saveData?: boolean
  readonly effectiveType?: string
}

const SLOW_TYPES = new Set(['slow-2g', '2g', '3g'])

/**
 * Whether to download the emulator runtime before the player picks a game. It is
 * about 13 MB, so it is skipped when the player asked to save data or the connection is slow.
 */
export const shouldWarmUp = (connection: ConnectionInfo | undefined): boolean =>
  !(connection?.saveData || SLOW_TYPES.has(connection?.effectiveType ?? ''))
