import { useCallback, useEffect, useRef, useState } from 'react'
import { LIBRARY_HREF } from '@/app/router'
import type { Game } from '@/domain/game'
import { useI18n } from '@/shared/i18n'
import { EmulatorFrame } from './EmulatorFrame'
import { Keypad } from './Keypad'
import { isForwardedKey, keyForGame } from './keys'
import styles from './PlayScreen.module.css'
import { backupFileName, backupText } from './saveBackup'
import { type KeyAction, useEmulatorBridge } from './useEmulatorBridge'

/** Milliseconds of loading after which the screen explains the wait. */
const SLOW_LOAD_MS = 12_000

/** The play screen: back link, title, the emulator and Pixelito's own keys. */
export function PlayScreen({ game }: { readonly game: Game }) {
  const { t } = useI18n()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const { state, sendKey: sendCode, canExportSaves, exportSaves } = useEmulatorBridge(frameRef)
  const [exportFailed, setExportFailed] = useState(false)
  const [slow, setSlow] = useState(false)
  const started = state === 'started'
  const sendKey = useCallback(
    (action: KeyAction, code: string) => {
      sendCode(action, keyForGame(code, game.confirmKey ?? 'enter'))
    },
    [sendCode, game.confirmKey],
  )

  useEffect(() => {
    if (started) return
    const timer = setTimeout(() => setSlow(true), SLOW_LOAD_MS)
    return () => clearTimeout(timer)
  }, [started])

  useEffect(() => {
    const forward = (action: 'down' | 'up') => (event: KeyboardEvent) => {
      if (event.repeat || !isForwardedKey(event.code)) return
      event.preventDefault()
      sendKey(action, event.code)
    }
    const onDown = forward('down')
    const onUp = forward('up')
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [sendKey])

  const saveDir = game.saveDir
  const exportGameSaves = async () => {
    if (!saveDir) return
    setExportFailed(false)
    try {
      const files = await exportSaves(game.id, saveDir)
      const url = URL.createObjectURL(
        new Blob([backupText(game.id, files)], { type: 'application/json' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.download = backupFileName(game.id)
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setExportFailed(true)
    }
  }

  return (
    <div className={styles.screen}>
      <header className={styles.bar}>
        <a className={styles.back} href={LIBRARY_HREF}>
          {t.play.back}
        </a>
        <h1 className={styles.title}>{game.title}</h1>
        {canExportSaves && saveDir && (
          <button type="button" className={styles.export} onClick={exportGameSaves}>
            {t.play.exportSaves}
          </button>
        )}
      </header>
      <div className={styles.stage}>
        <EmulatorFrame
          className={styles.frame}
          frameRef={frameRef}
          state={state}
          title={t.play.screen}
          jar={game.emulatorJar}
        />
        {exportFailed && (
          <p className={styles.status} role="alert">
            {t.play.exportFailed}
          </p>
        )}
        {!started && <p className={styles.status}>{slow ? t.play.slow : t.play.loading}</p>}
      </div>
      <Keypad onKey={sendKey} />
    </div>
  )
}
