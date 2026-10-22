# Notes — Compatibility labels and smoke test (Phase 0, task 8)

- **Date:** 2026-10-22
- **Status:** First pass. Criteria are a proposal. The smoke test ran once on two games in headless Chromium (local emulator, scratch scripts outside the repo).

## Proposed labels

| Label | Meaning (all checked on the same browser and device class) |
|---|---|
| **Playable** | Starts, renders, responds to input, a full session works, and saves persist if the game has them |
| **Partial** | Starts and is usable, but something named is wrong (sound, a screen, a control, saves, speed). The reason is shown |
| **Does not run** | Does not start, crashes, or cannot be controlled |
| **Untested** | No result yet. This is the default |

Rules: a label belongs to a game **plus** a browser/device class (a game can be Playable on desktop Chromium and Untested on Android); a label has a date and the emulator build it was tested with; **only a human can grant Playable** (the smoke test can only rule things out or suggest Partial); an automated pass never upgrades a label by itself.

## Automated smoke test (what it can and cannot say)

Checks per game: the `loading` element becomes hidden (game started), the canvas is non-empty (count of distinct colours), a screenshot is saved, no uncaught page errors, and the screen content changes after keyboard input.

First run, Chromium, game opened from the launcher on a warm profile:

| Game | Started | Start time | Canvas | Input | Page errors |
|---|---|---|---|---|---|
| GAEM | yes | 4.3 s | 240×320, 118 then 1433 colours | screen changed (title menu to game) | none |
| PacMan | yes | 5.1 s | 240×320, 197 then 202 colours | inconclusive (see below) | none |

Screenshots (read by eye): PacMan shows an animated intro with a "Next" soft key; frames differ between captures, and the second frame has a black smear near the top right that I cannot tell apart from an intended effect or a rendering fault. **PacMan is Untested, not Playable**: nobody played it.

## Lessons for the real harness

1. **The "screen changed" check was weak.** My signature used only the first 50 colours, so it said "no change" for PacMan even though the frames visibly differ. Use a hash of the full pixel data, and test input on a static screen, because an animated intro changes with no input at all.
2. A passing smoke test proves little by itself: start time, a non-blank canvas and no errors do not show that the game is playable. It is a regression alarm, not a verdict.
3. Start times here (4 to 5 s) are not comparable with the earlier 1.2 to 2.3 s Chromium numbers, because this harness opens a fresh profile and installs the jar each time. Do not mix them.
4. Games differ in how to reach gameplay (soft keys `F1`/`F2`, Enter, numpad), so each game needs its own input script. This does not scale; a human "play for a minute" step stays in the loop.

## Not covered

Android and Firefox runs, sound, speed (FPS), long sessions, saves per game, and more than two games.

## Next

1. Fix the signature (full hash) and add a per-game input script file.
2. Decide where labels live (a field in the catalogue entry) and what the UI shows (label, date, tested browser).
3. Re-run on Firefox and, when possible, a phone.
