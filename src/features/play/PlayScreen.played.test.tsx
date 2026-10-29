// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Game } from '@/domain/game'
import { I18nProvider } from '@/shared/i18n'
import { readLastPlayed } from '@/shared/lastPlayed'
import { PlayScreen } from './PlayScreen'
import type { EmulatorState } from './useEmulatorBridge'

const bridge = vi.hoisted(() => ({ state: 'loading' as EmulatorState }))

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

describe('PlayScreen records the last played time', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('does not record a game that has not started', () => {
    bridge.state = 'ready'
    renderScreen()
    expect(readLastPlayed('demo')).toBeUndefined()
  })

  it('records the game once the emulator has started it', () => {
    bridge.state = 'started'
    const before = Date.now()
    renderScreen()
    expect(readLastPlayed('demo')).toBeGreaterThanOrEqual(before)
  })
})
