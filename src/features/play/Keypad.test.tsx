// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '@/shared/i18n'
import { MESSAGES } from '@/shared/i18n/messages'
import { Keypad } from './Keypad'
import { KEY } from './keys'

const okButton = () =>
  screen.getByRole('button', {
    name: new RegExp(`^(${MESSAGES.es.keys.ok}|${MESSAGES.en.keys.ok})$`),
  })

describe('Keypad key press', () => {
  const vibrate = vi.fn()
  const onKey = vi.fn()

  beforeEach(() => {
    vibrate.mockClear()
    onKey.mockClear()
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true })
    // jsdom has no pointer capture.
    HTMLElement.prototype.setPointerCapture = vi.fn()
    render(
      <I18nProvider>
        <Keypad onKey={onKey} />
      </I18nProvider>,
    )
  })
  afterEach(() => {
    cleanup()
    Reflect.deleteProperty(navigator, 'vibrate')
  })

  it('sends down on press and up on release', () => {
    fireEvent.pointerDown(okButton())
    fireEvent.pointerUp(okButton())
    expect(onKey.mock.calls).toEqual([
      ['down', KEY.ok],
      ['up', KEY.ok],
    ])
  })

  it('gives a short vibration tick on press only', () => {
    fireEvent.pointerDown(okButton())
    expect(vibrate).toHaveBeenCalledTimes(1)
    fireEvent.pointerUp(okButton())
    expect(vibrate).toHaveBeenCalledTimes(1)
  })

  it('still works on browsers without vibration support', () => {
    Reflect.deleteProperty(navigator, 'vibrate')
    fireEvent.pointerDown(okButton())
    expect(onKey).toHaveBeenCalledWith('down', KEY.ok)
  })
})
