import { useCallback, useEffect, useRef, useState } from 'react'
import { LIBRARY_HREF } from '@/app/router'
import type { Game } from '@/domain/game'
import { useI18n } from '@/shared/i18n'
import { markPlayed } from '@/shared/lastPlayed'
import { useMatchMedia } from '@/shared/useMatchMedia'
import {
  markHelpSeen,
  readHelpSeen,
  readPadVisible,
  readPanelOpen,
  writePadVisible,
  writePanelOpen,
} from './controlsPrefs'
import { EmulatorFrame } from './EmulatorFrame'
import { HelpPanel } from './HelpPanel'
import { HelpSheet } from './HelpSheet'
import { Keypad } from './Keypad'
import { canonicalKey, keyForGame } from './keys'
import styles from './PlayScreen.module.css'
import { backupFileName, backupText } from './saveBackup'
import { type KeyAction, useEmulatorBridge } from './useEmulatorBridge'

/** Milliseconds of loading after which the screen explains the wait. */
const SLOW_LOAD_MS = 12_000

/** Milliseconds a started game waits for input before the screen suggests pressing OK. */
const IDLE_HINT_MS = 8_000

/** A window wide enough, with a mouse, to keep the controls beside the game instead of over it. */
const SIDE_PANEL_QUERY = '(min-width: 900px) and (pointer: fine)'

/** The play screen: back link, title, the emulator and Pixelito's own keys. */
export function PlayScreen({ game }: { readonly game: Game }) {
  const { t } = useI18n()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const { state, sendKey: sendCode, canExportSaves, exportSaves } = useEmulatorBridge(frameRef)
  const [exportFailed, setExportFailed] = useState(false)
  const [slow, setSlow] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [idle, setIdle] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(readPanelOpen)
  const side = useMatchMedia(SIDE_PANEL_QUERY)
  // Beside the game the controls never block it; elsewhere they are a sheet that does.
  const modalOpen = helpOpen && !side
  const [padVisible, setPadVisible] = useState(readPadVisible)
  const [lit, setLit] = useState<ReadonlySet<string>>(new Set())
  const started = state === 'started'
  const sendKey = useCallback(
    (action: KeyAction, code: string) => {
      setPressed(true)
      sendCode(action, keyForGame(code, game.confirmKey ?? 'enter'))
    },
    [sendCode, game.confirmKey],
  )

  useEffect(() => {
    if (started) markPlayed(game.id)
  }, [started, game.id])

  // The first time a game starts, show the controls once so nobody has to guess them.
  useEffect(() => {
    if (!started || readHelpSeen()) return
    markHelpSeen()
    if (!side) setHelpOpen(true)
  }, [started, side])

  const closeHelp = useCallback(() => setHelpOpen(false), [])
  const closePanel = () => {
    setPanelOpen(false)
    writePanelOpen(false)
  }
  const toggleHelp = () => {
    if (!side) return setHelpOpen(true)
    setPanelOpen(!panelOpen)
    writePanelOpen(!panelOpen)
  }
  const changePadVisible = (visible: boolean) => {
    setPadVisible(visible)
    writePadVisible(visible)
  }

  useEffect(() => {
    if (started) return
    const timer = setTimeout(() => setSlow(true), SLOW_LOAD_MS)
    return () => clearTimeout(timer)
  }, [started])

  useEffect(() => {
    if (!started || pressed) return
    const timer = setTimeout(() => setIdle(true), IDLE_HINT_MS)
    return () => clearTimeout(timer)
  }, [started, pressed])

  useEffect(() => {
    if (modalOpen) return
    const forward = (action: 'down' | 'up') => (event: KeyboardEvent) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      const code = canonicalKey(event.code)
      if (!code) return
      event.preventDefault()
      setLit((current) => {
        const next = new Set(current)
        if (action === 'down') next.add(code)
        else next.delete(code)
        return next
      })
      sendKey(action, code)
    }
    const onDown = forward('down')
    const onUp = forward('up')
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [sendKey, modalOpen])

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
    <div className={`${styles.screen} ${side && panelOpen ? styles.withPanel : ''}`}>
      <header className={styles.bar} inert={modalOpen}>
        <a className={styles.back} href={LIBRARY_HREF}>
          {t.play.back}
        </a>
        <h1 className={styles.title}>{game.title}</h1>
        <button
          type="button"
          className={styles.help}
          aria-label={t.help.open}
          aria-haspopup={side ? undefined : 'dialog'}
          aria-expanded={side ? panelOpen : undefined}
          onClick={toggleHelp}
        >
          ?
        </button>
        {canExportSaves && saveDir && (
          <button type="button" className={styles.export} onClick={exportGameSaves}>
            {t.play.exportSaves}
          </button>
        )}
      </header>
      <main className={styles.content} inert={modalOpen}>
        <div className={styles.stage}>
          <EmulatorFrame
            className={`${styles.frame} ${started || slow ? styles.shown : ''} ${modalOpen ? styles.covered : ''}`}
            frameRef={frameRef}
            state={state}
            title={t.play.screen}
            jar={game.emulatorJar}
          />
          {exportFailed && (
            <p className={styles.alert} role="alert">
              {t.play.exportFailed}
            </p>
          )}
          {!started && (
            <div className={styles.status}>
              <div className={styles.loader} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <p>{slow ? t.play.slow : t.play.loading}</p>
            </div>
          )}
        </div>
        <p className={styles.hint} role="status">
          {started && idle && !pressed ? (padVisible ? t.play.idle : t.play.idleKeyboard) : ''}
        </p>
        {padVisible && <Keypad onKey={sendKey} lit={lit} />}
      </main>
      {side && panelOpen && (
        <HelpPanel
          onClose={closePanel}
          padVisible={padVisible}
          onPadVisibleChange={changePadVisible}
        />
      )}
      {modalOpen && (
        <HelpSheet
          onClose={closeHelp}
          padVisible={padVisible}
          onPadVisibleChange={changePadVisible}
        />
      )}
    </div>
  )
}
