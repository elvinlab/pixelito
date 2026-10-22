import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { detectLocale, type Locale } from './locale'
import { MESSAGES, type Messages } from './messages'

const STORAGE_KEY = 'pixelito.locale'

interface I18n {
  readonly locale: Locale
  readonly t: Messages
  readonly setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18n | null>(null)

/** Storage can be blocked (private windows, site settings); the app must still work. */
const readSaved = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

/** Provides the interface language, remembers the player's choice and sets `<html lang>`. */
export function I18nProvider({ children }: { readonly children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    detectLocale(readSaved(), navigator.languages),
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // The choice still applies for this visit.
    }
  }, [])

  const value = useMemo(() => ({ locale, t: MESSAGES[locale], setLocale }), [locale, setLocale])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** The current language, its messages and a way to change it. */
export function useI18n(): I18n {
  const value = useContext(I18nContext)
  if (!value) throw new Error('useI18n must be used inside I18nProvider')
  return value
}
