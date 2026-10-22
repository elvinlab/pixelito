/** Languages the interface is translated into. */
export const LOCALES = ['es', 'en'] as const

/** One of the supported interface languages. */
export type Locale = (typeof LOCALES)[number]

/** Spanish is the default: used when nothing else says otherwise. */
export const DEFAULT_LOCALE: Locale = 'es'

const isLocale = (value: string | null): value is Locale =>
  LOCALES.some((locale) => locale === value)

/**
 * Picks the interface language: the player's saved choice first, then the first
 * browser language Pixelito supports, then Spanish.
 */
export function detectLocale(saved: string | null, browserLanguages: readonly string[]): Locale {
  if (isLocale(saved)) return saved
  for (const tag of browserLanguages) {
    const primary = tag.toLowerCase().split('-')[0] ?? ''
    if (isLocale(primary)) return primary
  }
  return DEFAULT_LOCALE
}
