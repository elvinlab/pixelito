// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useInstallPrompt } from './installPrompt'

function Probe() {
  const { canInstall, install } = useInstallPrompt()
  return canInstall ? (
    <button type="button" onClick={() => void install()}>
      install
    </button>
  ) : (
    <p>nothing to install</p>
  )
}

const promptEvent = (outcome: 'accepted' | 'dismissed' = 'accepted') => {
  const event = new Event('beforeinstallprompt', { cancelable: true })
  const prompt = vi.fn().mockResolvedValue(undefined)
  Object.assign(event, { prompt, userChoice: Promise.resolve({ outcome }) })
  return { event, prompt }
}

describe('useInstallPrompt', () => {
  afterEach(() => {
    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })
    cleanup()
  })

  it('offers nothing until the browser says the app can be installed', () => {
    render(<Probe />)
    expect(screen.getByText('nothing to install')).toBeTruthy()
  })

  it('holds the browser prompt back and offers install once it arrives', () => {
    render(<Probe />)
    const { event } = promptEvent()
    act(() => {
      window.dispatchEvent(event)
    })
    expect(event.defaultPrevented).toBe(true)
    expect(screen.getByRole('button', { name: 'install' })).toBeTruthy()
  })

  it('shows the prompt on click and stops offering install afterwards', async () => {
    render(<Probe />)
    const { event, prompt } = promptEvent()
    act(() => {
      window.dispatchEvent(event)
    })
    await act(async () => {
      screen.getByRole('button', { name: 'install' }).click()
    })
    expect(prompt).toHaveBeenCalledTimes(1)
    expect(screen.getByText('nothing to install')).toBeTruthy()
  })

  it('stops offering install once the app is installed', () => {
    render(<Probe />)
    act(() => {
      window.dispatchEvent(promptEvent().event)
    })
    act(() => {
      window.dispatchEvent(new Event('appinstalled'))
    })
    expect(screen.getByText('nothing to install')).toBeTruthy()
  })
})
