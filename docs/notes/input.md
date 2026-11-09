# Notes — Input (Phase 0, task 7)

- **Date:** 2026-10-22
- **Status:** First pass. Part 1 is read from the `freej2me-web` source (`web/src/key.js`, `web/src/screenKbd.js`, `PointerEvent.java`), read only. Part 2 is a proposal, not tested.
- **Rule:** ideas from other projects only, no code copied (see `roylays-plays.md`).

## What the emulator already gives us (verified in source)

1. **Keyboard:** `codeMap` in `key.js` maps DOM `KeyboardEvent.code` to Java key codes: Enter, Backspace, Delete, arrows, Escape, Space, `Digit0-9`, `Numpad0-9`, `NumpadDivide`, `NumpadMultiply`, `F1`/`F2`/`F3`, letters `KeyA...`. Soft keys are `F1` (left) and `F2` (right), as measured in the GAEM test.
2. **Key repeat** is done by a `KeyRepeatManager` in JS: a quick press and release emits `click`; holding emits `repeat` after a delay. The bridge prototype bypassed it by queueing raw events, so the real bridge must decide which path to use (task 5 follow-up).
3. **Touch:** `screenKbd.js` handles an on-screen keypad with multi-touch (touch id to key map, slide from key to key, cancel handling), listeners with `passive: false`.
4. **Pointer events** reach Java as unscaled `x, y`; JS does the scaling. Earlier test: a click on a soft-key label did nothing in GAEM, so pointer input is not a replacement for soft keys.
5. **Gamepad:** a search for `gamepad` in `web/src` found no matches in the lines I searched (first 30 hits only). Treat the Gamepad API as **not supported** until checked properly.

## Proposal (untested)

| Scheme | Intent | Mapping idea |
|---|---|---|
| Classic | Like a phone | Numpad digits, arrows or `5` as fire, F1/F2 soft keys |
| Modern | Keyboard players | Arrows or WASD to directions, Space or Enter as fire, Q/E as soft keys |
| Touch | Phones | On-screen D-pad, fire, two soft keys, `*`/`#`, digits on demand; multi-touch |
| Gamepad | Controllers | D-pad and stick to arrows, A to fire, shoulders to soft keys; menu navigation of the app shell |

- Mapping lives **in the app**, not the emulator: the app translates device input into `key {action, code}` messages (the protocol already has them). This keeps the emulator replaceable and lets remapping be per game, stored locally.
- A live "test your controls" screen is a good, cheap feature (idea from `roylays-plays.md`).
- Keep Esc and browser shortcuts free; do not capture keys when focus is outside the game.

## Implemented in the app (2026-11-09)

Built in `src/features/play`; the emulator is untouched, the app only translates keys.

- **Physical keyboard** (`keys.ts`, `canonicalKey`): arrows or WASD move, Enter or Space is OK, Z is the left soft key (also F1), X is the right soft key (also F2), Esc is back, `0-9` are digits. Keys held with Ctrl, Meta or Alt stay with the browser. The matching on-screen key lights up while a physical key is held.
- **Controls help:** a `?` button in the play bar shows the key map for keyboard and touch (`HelpContent.tsx`). The soft keys are explained as doing what the game writes in the bottom corners of its screen.
  - **Desktop** (width of 900 px or more and a mouse, `(pointer: fine)`): `HelpPanel.tsx`, a side panel next to the game. It is not modal, so every key keeps reaching the game; `?` or its close button toggles it, and the choice is remembered (`pixelito.panel`, open by default).
  - **Phones and narrow windows:** `HelpSheet.tsx`, a modal sheet that opens by itself the first time any game starts (`pixelito.helpSeen`). While it is open no key reaches the game, so Esc closes the sheet instead of sending Back. The emulator frame is not rendered meanwhile: the emulator calls `display.focus()` whenever its canvas blurs, so a rendered frame (even `inert` or `visibility: hidden`) keeps taking the keyboard back.
- **On-screen keys** (`controlsPrefs.ts`): shown by default on touch screens (`pointer: coarse`), hidden with a mouse, with a checkbox in the help sheet to override (`pixelito.pad`). The idle hint names Enter instead of OK when they are hidden.
- **Touch pad:** OK is larger than the arrows, and the numbers toggle reads `123`.
- **Not done:** a left-handed layout (the D-pad is centred, so mirroring changes nothing), per-game soft key captions (no catalogue data for them yet), gamepad.

## Risks and unknowns

1. Gamepad needs the Gamepad API polling in the host app; latency and mobile browser support not measured.
2. Touch keypad layout per game (some games need `*`, `#`, or a stylus-like pointer) is unmeasured; one game tested only.
3. Soft keys on touch devices: a visible, large target is needed, since pointer clicks on the in-game label did nothing.
4. Input latency numbers belong to task 14 (device benchmarks).

## Next

1. Grep the whole `web/src` for gamepad and pointer handling to confirm item 5.
2. Decide the bridge key path (raw down/up versus the repeat helper).
3. Build the touch keypad and a keyboard remap table in the host-app prototype (task 4 spike).
