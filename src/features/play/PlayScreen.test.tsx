// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Game } from '@/domain/game'
import { I18nProvider } from '@/shared/i18n'
import { MESSAGES } from '@/shared/i18n/messages'
import { PlayScreen } from './PlayScreen'

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

describe('PlayScreen loading status', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  const loading = [MESSAGES.es.play.loading, MESSAGES.en.play.loading]
  const slow = [MESSAGES.es.play.slow, MESSAGES.en.play.slow]
  const shown = (texts: readonly string[]) => texts.some((text) => screen.queryByText(text))

  it('shows the plain loading text at first', () => {
    renderScreen()
    expect(shown(loading)).toBe(true)
    expect(shown(slow)).toBe(false)
  })

  it('explains the wait once loading takes too long', () => {
    renderScreen()
    act(() => {
      vi.advanceTimersByTime(12_000)
    })
    expect(shown(slow)).toBe(true)
    expect(shown(loading)).toBe(false)
  })
})
