import type { CSSProperties } from 'react'
import { playHref } from '@/app/router'
import { PRODUCT_NAME, SOURCE_URL } from '@/config'
import { EmulatorWarmup } from '@/features/play'
import { LanguageSwitch, useI18n } from '@/shared/i18n'
import { CompatibilityBadge } from '@/shared/ui'
import { CATALOG } from './catalog'
import styles from './LibraryScreen.module.css'

/** The home screen: every game Pixelito offers, with one obvious action each. */
export function LibraryScreen() {
  const { t } = useI18n()
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
              <h3 className={styles.title}>{game.title}</h3>
              <CompatibilityBadge status={game.compatibility} />
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
