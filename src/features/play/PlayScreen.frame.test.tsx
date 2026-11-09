// @vitest-environment jsdom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Game } from '@/domain/game'
import { I18nProvider } from '@/shared/i18n'
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

const frame = () =>
  render(
    <I18nProvider>
      <PlayScreen game={GAME} />
    </I18nProvider>,
  ).container.querySelector('iframe')

describe('PlayScreen emulator frame', () => {
  afterEach(cleanup)

  it('keeps the frame hidden while the game loads', () => {
    bridge.state = 'loading'
    expect(frame()?.className).not.toMatch(/shown/)
  })

  it('reveals the frame once the game has started', () => {
    bridge.state = 'started'
    expect(frame()?.className).toMatch(/shown/)
  })
})
