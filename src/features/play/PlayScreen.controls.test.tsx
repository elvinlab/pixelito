// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Game } from '@/domain/game'
import { I18nProvider } from '@/shared/i18n'
import { MESSAGES } from '@/shared/i18n/messages'
import { markHelpSeen, readHelpSeen, readPanelOpen } from './controlsPrefs'
import { PlayScreen } from './PlayScreen'
import type { EmulatorState } from './useEmulatorBridge'

const bridge = vi.hoisted(() => ({ state: 'started' as EmulatorState, sendKey: vi.fn() }))

vi.mock('./useEmulatorBridge', () => ({
  useEmulatorBridge: () => ({
    state: bridge.state,
    sendKey: bridge.sendKey,
    canExportSaves: false,
    exportSaves: vi.fn(),
  }),
}))

const GAME: Game = {
  id: 'demo',
  title: 'Demo',
  compatibility: 'untested',
  accent: '#00ffff',
  emulatorJar: 'demo.jar',
}

const renderScreen = () =>
  render(
    <I18nProvider>
      <PlayScreen game={GAME} />
    </I18nProvider>,
  )

const either = (pick: (m: typeof MESSAGES.es) => string) =>
  new RegExp(`^(${pick(MESSAGES.es)}|${pick(MESSAGES.en)})$`)
const helpTitle = () => screen.queryByRole('dialog')
const okKey = () => screen.queryByRole('button', { name: either((m) => m.keys.ok) })

/** Stubs `matchMedia`: `coarse` answers the touch query, `side` the wide-with-a-mouse query. */
const matchPointer = (coarse: boolean, side = false) =>
  vi.stubGlobal(
    'matchMedia',
    (query: string) => ({ matches: query.includes('coarse') ? coarse : side }) as MediaQueryList,
  )

beforeEach(() => {
  bridge.state = 'started'
  bridge.sendKey.mockClear()
  matchPointer(true)
  HTMLElement.prototype.setPointerCapture = vi.fn()
})
afterEach(() => {
  cleanup()
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('PlayScreen controls help', () => {
  it('opens on its own the first time a game starts, and only then', () => {
    renderScreen()
    expect(helpTitle()).not.toBeNull()
    expect(readHelpSeen()).toBe(true)
    cleanup()
    renderScreen()
    expect(helpTitle()).toBeNull()
  })

  it('does not open while the game is still loading', () => {
    bridge.state = 'loading'
    renderScreen()
    expect(helpTitle()).toBeNull()
    expect(readHelpSeen()).toBe(false)
  })

  it('opens from the ? button and closes with the close button', () => {
    markHelpSeen()
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: either((m) => m.help.open) }))
    expect(helpTitle()).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: either((m) => m.help.close) }))
    expect(helpTitle()).toBeNull()
  })

  it('closes on Escape without sending Back to the game', () => {
    renderScreen()
    fireEvent.keyDown(window, { code: 'Escape', key: 'Escape' })
    expect(helpTitle()).toBeNull()
    expect(bridge.sendKey).not.toHaveBeenCalled()
  })

  it('takes focus back when the game frame grabs it', () => {
    renderScreen()
    const close = screen.getByRole('button', { name: either((m) => m.help.close) })
    close.blur()
    expect(document.activeElement).not.toBe(close)
    fireEvent.blur(window)
    expect(document.activeElement).toBe(close)
  })

  it('keeps the game from receiving keys while it is open', () => {
    renderScreen()
    fireEvent.keyDown(window, { code: 'Enter', key: 'Enter' })
    expect(bridge.sendKey).not.toHaveBeenCalled()
  })
})

describe('PlayScreen physical keyboard', () => {
  beforeEach(() => markHelpSeen())

  it.each([
    ['KeyZ', 'F1'],
    ['KeyX', 'F2'],
    ['Space', 'Enter'],
    ['KeyW', 'ArrowUp'],
  ])('sends %s as %s', (code, sent) => {
    renderScreen()
    fireEvent.keyDown(window, { code })
    fireEvent.keyUp(window, { code })
    expect(bridge.sendKey).toHaveBeenNthCalledWith(1, 'down', sent)
    expect(bridge.sendKey).toHaveBeenNthCalledWith(2, 'up', sent)
  })

  it('leaves browser shortcuts alone', () => {
    renderScreen()
    fireEvent.keyDown(window, { code: 'KeyW', ctrlKey: true })
    fireEvent.keyDown(window, { code: 'Space', metaKey: true })
    expect(bridge.sendKey).not.toHaveBeenCalled()
  })

  it('lights the on-screen key while the physical key is held', () => {
    renderScreen()
    fireEvent.keyDown(window, { code: 'Enter' })
    expect(okKey()?.hasAttribute('data-lit')).toBe(true)
    fireEvent.keyUp(window, { code: 'Enter' })
    expect(okKey()?.hasAttribute('data-lit')).toBe(false)
  })
})

describe('PlayScreen on-screen keys', () => {
  beforeEach(() => markHelpSeen())

  it('shows them on a touch screen and hides them with a mouse', () => {
    renderScreen()
    expect(okKey()).not.toBeNull()
    cleanup()
    matchPointer(false)
    renderScreen()
    expect(okKey()).toBeNull()
  })

  it('lets the player turn them on from the help and remembers it', () => {
    matchPointer(false)
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: either((m) => m.help.open) }))
    fireEvent.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: either((m) => m.help.close) }))
    expect(okKey()).not.toBeNull()
    cleanup()
    renderScreen()
    expect(okKey()).not.toBeNull()
  })

  it('names Enter in the idle hint when there are no on-screen keys', () => {
    vi.useFakeTimers()
    matchPointer(false)
    renderScreen()
    act(() => vi.advanceTimersByTime(8_000))
    expect(screen.getByText(/enter/i)).toBeTruthy()
    vi.useRealTimers()
  })
})

describe('PlayScreen side panel on desktop', () => {
  const panel = () => screen.queryByRole('complementary')
  const toggle = () => screen.getByRole('button', { name: either((m) => m.help.open) })

  beforeEach(() => matchPointer(false, true))

  it('shows the controls beside the game, not over it, the first time', () => {
    renderScreen()
    expect(panel()).not.toBeNull()
    expect(helpTitle()).toBeNull()
    expect(readHelpSeen()).toBe(true)
  })

  it('keeps sending keys to the game while the panel is open', () => {
    renderScreen()
    fireEvent.keyDown(window, { code: 'Escape', key: 'Escape' })
    expect(bridge.sendKey).toHaveBeenCalledWith('down', 'Escape')
    expect(panel()).not.toBeNull()
  })

  it('toggles from the ? button and remembers the choice', () => {
    renderScreen()
    expect(toggle().getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(toggle())
    expect(panel()).toBeNull()
    expect(readPanelOpen()).toBe(false)
    cleanup()
    renderScreen()
    expect(panel()).toBeNull()
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(toggle())
    expect(panel()).not.toBeNull()
  })

  it('closes from its own close button', () => {
    renderScreen()
    fireEvent.click(screen.getByRole('button', { name: either((m) => m.help.close) }))
    expect(panel()).toBeNull()
  })

  it('uses the sheet instead when the window is not wide with a mouse', () => {
    cleanup()
    matchPointer(false, false)
    renderScreen()
    expect(panel()).toBeNull()
    expect(helpTitle()).not.toBeNull()
  })
})
