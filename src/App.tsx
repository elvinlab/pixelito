import { NotFoundScreen } from '@/app/NotFoundScreen'
import { useRoute } from '@/app/router'
import { findGame, LibraryScreen } from '@/features/library'
import { PlayScreen } from '@/features/play'

/** Root component: shows the screen the URL hash asks for. */
export function App() {
  const route = useRoute()
  const game = route.name === 'play' ? findGame(route.gameId) : undefined
  // Keyed by screen, so each one fades in when it replaces the last.
  const screen =
    route.name === 'library' ? (
      <LibraryScreen />
    ) : game ? (
      <PlayScreen game={game} />
    ) : (
      <NotFoundScreen />
    )
  const key = route.name === 'play' ? `play:${route.gameId}` : route.name
  return (
    <div key={key} className="screen-enter">
      {screen}
    </div>
  )
}
