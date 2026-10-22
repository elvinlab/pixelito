import { useSyncExternalStore } from 'react'

/** A screen the app can show. */
export type Route =
  | { readonly name: 'library' }
  | { readonly name: 'play'; readonly gameId: string }
  | { readonly name: 'not-found' }

const PLAY_ROUTE = /^#\/play\/([a-z0-9-]{1,32})$/

/** Turns a URL hash into a route. Anything unrecognised is `not-found`. */
export function parseRoute(hash: string): Route {
  if (hash === '' || hash === '#' || hash === '#/') return { name: 'library' }
  const play = PLAY_ROUTE.exec(hash)
  if (play?.[1]) return { name: 'play', gameId: play[1] }
  return { name: 'not-found' }
}

/** The hash that opens a game's play screen. */
export const playHref = (gameId: string) => `#/play/${gameId}`

/** The hash that opens the library. */
export const LIBRARY_HREF = '#/'

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

/** The current route, kept in sync with the URL hash. */
export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return parseRoute(hash)
}
