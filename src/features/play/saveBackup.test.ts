import { describe, expect, it } from 'vitest'
import { backupFileName, backupText, type SaveBackup } from './saveBackup'

const bytes = (...values: number[]) => new Uint8Array(values).buffer

describe('backupText', () => {
  it('records the game and each file path with its bytes in base64', () => {
    const text = backupText('rally', [{ path: '/Rally/rms/OPT', data: bytes(0, 1, 2, 255) }])
    const backup = JSON.parse(text) as SaveBackup
    expect(backup).toEqual({
      format: 'pixelito-saves',
      version: 1,
      game: 'rally',
      files: [{ path: '/Rally/rms/OPT', data: 'AAEC/w==' }],
    })
  })

  it('encodes a file larger than one chunk without losing bytes', () => {
    const big = new Uint8Array(0x8000 * 2 + 5).fill(7)
    const backup = JSON.parse(
      backupText('g', [{ path: '/a/rms/b', data: big.buffer }]),
    ) as SaveBackup
    const decoded = Uint8Array.from(atob(backup.files[0]?.data ?? ''), (c) => c.charCodeAt(0))
    expect(decoded).toEqual(big)
  })

  it('writes an empty file list when there are no saves', () => {
    expect((JSON.parse(backupText('g', [])) as SaveBackup).files).toEqual([])
  })
})

describe('backupFileName', () => {
  it('uses the game id', () => expect(backupFileName('rally')).toBe('rally-saves.json'))
})
