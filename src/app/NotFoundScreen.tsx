import { useI18n } from '@/shared/i18n'
import styles from './NotFoundScreen.module.css'
import { LIBRARY_HREF } from './router'

/** Shown for any route or game id Pixelito does not know. */
export function NotFoundScreen() {
  const { t } = useI18n()
  return (
    <main className={styles.screen}>
      <p className={styles.code} aria-hidden="true">
        404
      </p>
      <h1 className={styles.title}>{t.notFound.title}</h1>
      <p className={styles.body}>{t.notFound.body}</p>
      <a className={styles.back} href={LIBRARY_HREF}>
        {t.notFound.back}
      </a>
    </main>
  )
}
