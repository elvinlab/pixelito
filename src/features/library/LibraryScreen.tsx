import type { CSSProperties } from 'react'
import { playHref } from '@/app/router'
import { PRODUCT_NAME, SOURCE_URL } from '@/config'
import { EmulatorWarmup } from '@/features/play'
import { LanguageSwitch, useI18n } from '@/shared/i18n'
import { describeLastPlayed, readLastPlayed } from '@/shared/lastPlayed'
import { CompatibilityBadge } from '@/shared/ui'
import { CATALOG } from './catalog'
import { initials } from './initials'
import styles from './LibraryScreen.module.css'

/** The home screen: every game Pixelito offers, with one obvious action each. */
export function LibraryScreen() {
  const { t, locale } = useI18n()
  const now = Date.now()
  const lastPlayedText = (gameId: string) => {
    const timestamp = readLastPlayed(gameId)
    return timestamp === undefined
      ? t.library.neverPlayed
      : t.library.lastPlayed(describeLastPlayed(timestamp, now, locale))
  }
  return (
    <div className={styles.screen}>
      <header className={styles.bar}>
        <h1 className={styles.logo}>{PRODUCT_NAME}</h1>
        <LanguageSwitch />
      </header>
      <EmulatorWarmup />
      <main className={styles.main}>
        <h2 className={styles.heading}>{t.library.heading}</h2>
        <ul className={styles.grid}>
          {CATALOG.map((game) => (
            <li
              key={game.id}
              className={styles.card}
              style={{ '--accent': game.accent } as CSSProperties}
            >
              <div className={styles.label} aria-hidden="true">
                {game.cover ? (
                  <img className={styles.cover} src={game.cover} alt="" />
                ) : (
                  <span className={styles.initials}>{initials(game.title)}</span>
                )}
              </div>
              <h3 className={styles.title}>{game.title}</h3>
              <CompatibilityBadge status={game.compatibility} />
              <p className={styles.meta}>{lastPlayedText(game.id)}</p>
              <a className={styles.play} href={playHref(game.id)}>
                {t.library.play}
                <span className={styles.visuallyHidden}> {game.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </main>
      <footer className={styles.footer}>
        <span>by elvinlab</span>
        <a className={styles.source} href={SOURCE_URL}>
          {t.library.source}
        </a>
      </footer>
    </div>
  )
}
