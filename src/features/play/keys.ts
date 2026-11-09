import type { ConfirmKey } from '@/domain/game'

/** Key codes the emulator understands. They are `KeyboardEvent.code` values. */
export const KEY = {
  softLeft: 'F1',
  softRight: 'F2',
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  ok: 'Enter',
  back: 'Escape',
  five: 'Digit5',
  star: 'NumpadMultiply',
  pound: 'NumpadDivide',
} as const

const DIGITS = /^Digit[0-9]$/

const FORWARDED = new Set<string>(Object.values(KEY))

/** Friendlier physical keys that stand in for the phone keys: WASD, Space, and Z/X for the soft keys. */
const ALIASES: Readonly<Record<string, string>> = {
  KeyZ: KEY.softLeft,
  KeyX: KEY.softRight,
  Space: KEY.ok,
  KeyW: KEY.up,
  KeyA: KEY.left,
  KeyS: KEY.down,
  KeyD: KEY.right,
}

/** The phone key a physical keyboard key stands for, or undefined when it belongs to the browser. */
export const canonicalKey = (code: string): string | undefined => {
  if (Object.hasOwn(ALIASES, code)) return ALIASES[code]
  return FORWARDED.has(code) || DIGITS.test(code) ? code : undefined
}

/** Whether a physical keyboard key should be forwarded to the game. */
export const isForwardedKey = (code: string) => canonicalKey(code) !== undefined

/**
 * The key code to send for a pressed key. OK sends what the game expects for
 * "accept": sending both Enter and 5 would skip two screens in one tap.
 */
export const keyForGame = (code: string, confirm: ConfirmKey): string =>
  code === KEY.ok && confirm === 'five' ? KEY.five : code
