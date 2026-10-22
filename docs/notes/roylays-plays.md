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
