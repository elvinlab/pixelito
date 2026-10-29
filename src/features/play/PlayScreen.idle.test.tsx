// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Game } from '@/domain/game'
import { I18nProvider } from '@/shared/i18n'
import { PlayScreen } from './PlayScreen'
import type { EmulatorState } from './useEmulatorBridge'

const bridge = vi.hoisted(() => ({ state: 'started' as EmulatorState }))

vi.mock('./useEmulatorBridge', () => ({
  useEmulatorBridge: () => ({
    state: bridge.state,
    sendKey: vi.fn(),
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

const HINT = /press ok|toca ok/i

describe('PlayScreen idle hint', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    bridge.state = 'started'
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('suggests pressing OK when a started game gets no input for a while', () => {
    renderScreen()
    expect(screen.queryByText(HINT)).toBeNull()
    act(() => vi.advanceTimersByTime(8_000))
    expect(screen.getByText(HINT)).toBeTruthy()
  })

  it('stays quiet once the player has pressed a key', () => {
    renderScreen()
    fireEvent.keyDown(window, { code: 'Enter' })
    act(() => vi.advanceTimersByTime(20_000))
    expect(screen.queryByText(HINT)).toBeNull()
  })

  it('does not hint while the game is still loading', () => {
    bridge.state = 'loading'
    renderScreen()
    act(() => vi.advanceTimersByTime(20_000))
    expect(screen.queryByText(HINT)).toBeNull()
  })
})
