import { useI18n } from '@/shared/i18n'
import { LIBRARY_HREF } from './router'

/** Shown for any route or game id Pixelito does not know. */
export function NotFoundScreen() {
  const { t } = useI18n()
  return (
    <main style={{ padding: 'var(--space-5) var(--space-4)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 400 }}>{t.notFound.title}</h1>
      <p>{t.notFound.body}</p>
      <a href={LIBRARY_HREF} style={{ color: 'var(--violet)' }}>
        {t.notFound.back}
      </a>
    </main>
  )
}
