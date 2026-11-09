# Blog ideas

Raw material for posts, written as the work happens. One entry per idea: problem, what was tried (including what failed), outcome, lesson. Facts only, no secrets.

## 2026-11-09 — An iframe that keeps stealing the keyboard

- **Problem:** a help dialog over the game closed with Esc in unit tests, but in a real browser Esc went to the game instead.
- **Tried:** `inert` on the page around the frame, `visibility: hidden` on the frame, calling `focus()` on the dialog, re-focusing on window `blur`. None worked.
- **Cause:** the emulator runs `display.focus()` on a timer every time its canvas blurs, so it always wins the focus fight. The cross-origin frame also ignored `inert`.
- **Outcome:** do not render the frame while a modal is open (`display: none`), since an unrendered element cannot take focus. On desktop the help became a non-modal side panel, so the problem does not exist there.
- **Lesson:** headless tests with a mocked frame passed; only a real browser run against the real emulator found it. Check which frame owns keyboard focus before blaming your own handlers.

## 2026-11-09 — Phone keys are not obvious in 2026

- **Problem:** the on-screen keys (soft keys L/R, OK, `*`, `#`, `5` to confirm) confused the owner, who built the app.
- **Decision:** keep the emulator untouched and translate in the app: WASD, Space and Z/X as aliases, the on-screen key lights up when the physical key is held, a help that says the soft keys do whatever the game writes in its bottom corners.
- **Dropped:** a left-handed layout (a centred D-pad mirrors to itself), per-game soft key captions (no data to fill them).
- **Lesson:** explain legacy input in the product, and say what you did not do and why.

## 2026-11-09 — Dark, green and light themes by tokens, measured

- **Problem:** three themes (night, green LCD "Handheld", day) must all stay readable.
- **Outcome:** themes are custom-property sets on `[data-theme]`; contrast was computed for every text and status colour (all at least 4.9:1), then an `axe` pass over every screen in every theme found three real issues the numbers missed (no `main` landmark, loading text on Day, white text on the OK key).
- **Lesson:** measure tokens, then audit the rendered screens; they catch different bugs. The always-black game stage needed fixed colours that ignore the theme.

## 2026-11-09 — An idle game looks like a broken one

- **Problem:** some games wait for a key on a splash screen; players thought the app was stuck.
- **Outcome:** after 8 s with no input a hint suggests pressing OK, in its own strip. The first version overlaid the game and covered its own soft key, so it moved.
- **Lesson:** never draw over another program's UI you cannot see; give your own hints their own space.
