import { NotFoundScreen } from '@/app/NotFoundScreen'
import { useRoute } from '@/app/router'
import { findGame, LibraryScreen } from '@/features/library'
import { PlayScreen } from '@/features/play'

/** Root component: shows the screen the URL hash asks for. */
export function App() {
  const route = useRoute()
  if (route.name === 'library') return <LibraryScreen />
  if (route.name === 'play') {
    const game = findGame(route.gameId)
    return game ? <PlayScreen game={game} /> : <NotFoundScreen />
  }
  return <NotFoundScreen />
}
