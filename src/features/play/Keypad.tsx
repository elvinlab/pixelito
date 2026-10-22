import { type PointerEvent, useEffect, useRef, useState } from 'react'
import { LIBRARY_HREF } from '@/app/router'
import { useI18n } from '@/shared/i18n'
import styles from './Keypad.module.css'
import { KEY } from './keys'
import type { KeyAction } from './useEmulatorBridge'

interface KeypadProps {
  readonly onKey: (action: KeyAction, code: string) => void
}

interface PadKeyProps extends KeypadProps {
  readonly code: string
  readonly label: string
  readonly name: string
  readonly className?: string | undefined
}

/** One on-screen key: down on press, up on release, cancel or unmount. */
function PadKey({ code, label, name, className, onKey }: PadKeyProps) {
  const held = useRef(false)

  const release = () => {
    if (!held.current) return
    held.current = false
    onKey('up', code)
  }
  const press = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    if (held.current) return
    held.current = true
    onKey('down', code)
  }
  // biome-ignore lint/correctness/useExhaustiveDependencies: release only on unmount
  useEffect(() => release, [])

  return (
    <button
      type="button"
      className={`${styles.key} ${className ?? ''}`}
      aria-label={name}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onContextMenu={(event) => event.preventDefault()}
    >
      {label}
    </button>
  )
}

const DIGIT_ROWS = ['123', '456', '789'] as const

/**
 * Pixelito's own keys: soft keys on the sides, the D-pad in the middle, and a
 * 0-9 tray that takes the D-pad's place so it never covers the game.
 */
export function Keypad({ onKey }: KeypadProps) {
  const { t } = useI18n()
  const [numbers, setNumbers] = useState(false)
  const key = (code: string, label: string, name: string, className?: string) => (
    <PadKey code={code} label={label} name={name} className={className} onKey={onKey} />
  )

  return (
    <div className={styles.pad}>
      <div className={styles.top}>
        {key(KEY.softLeft, 'L', t.keys.softLeft)}
        {numbers ? (
          <div className={styles.tray}>
            {DIGIT_ROWS.flatMap((row) =>
              [...row].map((digit) => key(`Digit${digit}`, digit, t.keys.number(digit))),
            )}
            {key(KEY.star, '*', t.keys.star)}
            {key('Digit0', '0', t.keys.number('0'))}
            {key(KEY.pound, '#', t.keys.pound)}
          </div>
        ) : (
          <div className={styles.dpad}>
            {key(KEY.up, '▲', t.keys.up, styles.up)}
            {key(KEY.left, '◀', t.keys.left, styles.left)}
            {key(KEY.ok, 'OK', t.keys.ok, styles.ok)}
            {key(KEY.right, '▶', t.keys.right, styles.right)}
            {key(KEY.down, '▼', t.keys.down, styles.down)}
          </div>
        )}
        {key(KEY.softRight, 'R', t.keys.softRight)}
      </div>
      <div className={styles.row}>
        <a className={styles.exit} href={LIBRARY_HREF}>
          {t.keys.exit}
        </a>
        {key(KEY.back, t.keys.back, t.keys.back)}
        <button
          type="button"
          className={styles.key}
          aria-pressed={numbers}
          onClick={() => setNumbers((open) => !open)}
        >
          {numbers ? t.keys.arrows : t.keys.numbers}
        </button>
      </div>
    </div>
  )
}
