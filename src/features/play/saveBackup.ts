import type { SaveBlob } from 'pixelito-protocol'

/** A save backup file: JSON with the bytes of each record store in base64. */
export interface SaveBackup {
  readonly format: 'pixelito-saves'
  readonly version: 1
  readonly game: string
  readonly files: readonly { readonly path: string; readonly data: string }[]
}

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  }
  return btoa(binary)
}

/** Builds the backup text for one game's saves. */
export function backupText(game: string, files: readonly SaveBlob[]): string {
  const backup: SaveBackup = {
    format: 'pixelito-saves',
    version: 1,
    game,
    files: files.map((file) => ({ path: file.path, data: toBase64(file.data) })),
  }
  return JSON.stringify(backup, null, 2)
}

/** The file name offered when the player saves the backup. */
export const backupFileName = (game: string): string => `${game}-saves.json`
