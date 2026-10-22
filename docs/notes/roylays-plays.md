# Notes — Roylays Plays (reference product)

- **Date:** 2026-10-22
- **Source:** the project's public README and `LICENSE` file, read through a fetch tool that summarises pages. Not run, not audited.
- **Status:** Reference only. Nothing from it is copied.

## What it is

A browser hub for `.jar` games built on `freej2me-web` (zb3's FreeJ2ME fork) and CheerpJ, so the same stack as Pixelito. Sidebar UI (Home, Add Game, Controls), play history, favourites, three control schemes, WebGL 2 for 3D games (M3G, Mascot Capsule v3), static hosting. Users add their own `.jar` from their computer and games run locally; the README does not say it distributes games.

## Licence and what it means for us

- The repository's `LICENSE` is FreeJ2ME's text (GPLv3, plus the separate ObjectWeb ASM licence). It is a fork of a GPLv3 project, so its code is GPLv3.
- Copying its code or UI into Pixelito's private app would make that app a GPL work, which ADR 0001 wants to avoid. **Use ideas only.** Ideas are not copyrightable; its code and any art are. Its art licence, if separate, was not read.
- Unverified: whether anything outside the FreeJ2ME licence text applies to the hub's own files.

## Ideas worth taking (task 7 and the library)

1. **Three control schemes:** Classical (numpad-style keyboard), Modern (WASD plus mouse), Pro (gamepad with button mapping and haptics). Fits phase 0 task 7.
2. **Live controls test screen** so players can check inputs before a game.
3. **Play history and favourites** in the library.
4. **In-game options on a key** (Esc): display size and compatibility flags.

## Where Pixelito differs (from the README only)

No mention of persistent saves with export, platform achievements or accounts. Those are Pixelito's planned differentiators; confirm by using the live app before relying on this.

## Next

Open the live app once (a browser visit, no uploads) to see how its saves and library behave, and note anything that changes the Pixelito scope.

## Live app, first look (2026-10-22, headless Chromium, fresh profile, read only)

Opened `roylays.github.io/Roylays-Plays/web/` on a 1280×800 and a 390×844 viewport. Nothing was uploaded or played.

- **Loading:** a branded splash with two phases, "Preparing engine…" then "Loading games…". The real interface appeared after about **8.1 s on desktop and 6.5 s on the phone viewport** (my check only waited for the first phase to end, so the desktop figure may include part of the second; one run each, fresh profile, not comparable with the numbers in `freej2me-web.md`). On the phone viewport a modal then asked to enter fullscreen ("No" or "Yes!").
- **Structure seen in the page:** Home, My Games, Add Game, History, Favorites, Controls, About, Settings, Import Data, Export Data, a control scheme selector (first value "Classical"), Fullscreen.
- **Platform bits:** it registers a service worker (`serviceWorker` available) and has **no web app manifest** (no `link rel=manifest`), so it is not installable as a PWA by that signal. It loads fonts from Google Fonts, a library from cdnjs and the runtime from `cjrtnc.leaningtech.com` (CheerpJ).
- **Takeaways for Pixelito (ideas only):** a splash hides but does not remove the 6 to 8 s start; the sidebar sections (history, favourites, controls test) match what we had as ideas; an installable manifest and offline shell would be a real difference; the fullscreen prompt is a pattern worth testing for phones. No code or art copied (GPLv3, see above).
- **Not seen:** the interface behind the splash on desktop (screenshot caught the second splash), the controls screen, and any game running.

