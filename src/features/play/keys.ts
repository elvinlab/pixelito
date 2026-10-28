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

/** Whether a physical keyboard key should be forwarded to the game. */
export const isForwardedKey = (code: string) => FORWARDED.has(code) || DIGITS.test(code)

/**
 * The key code to send for a pressed key. OK sends what the game expects for
 * "accept": sending both Enter and 5 would skip two screens in one tap.
 */
export const keyForGame = (code: string, confirm: ConfirmKey): string =>
  code === KEY.ok && confirm === 'five' ? KEY.five : code
