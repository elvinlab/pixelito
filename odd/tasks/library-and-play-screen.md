# Library and play screen

Objective: replace the bare title and iframe with a library screen and a play screen in Pixelito's own look. Branch: develop. Runner: Vitest (pure logic) plus `pnpm check`. No push without an explicit yes.

## Specs

- S1: A library screen listing the catalogue games, each with its compatibility label and a Play action. Tokens and color roles from `docs/notes/visual-direction.md`.
- S2: A play screen with a back action, the game title, the emulator, and Pixelito's own on-screen keys that send `key` messages through the protocol (the emulator's built-in keypad is no longer used).
- S3: Screens are addressed by URL hash (`#/`, `#/play/<id>`); an unknown route or game id shows a not-found screen and never reaches the emulator.
- Assumptions (not from the owner): the catalogue is GAEM only, because only it is cleared (docs/notes/demo-games.md); the canvas design is provisional, so fidelity is structural, not pixel-exact; fonts (Press Start 2P and the rest) are not self-hosted yet; "Add your .jar", favorites, history, tabs, profile and the thumb field are out of this slice.

- S4 Interface in Spanish and English, Spanish by default; saved choice, then browser language, then Spanish. "tiene que ser muy amigable". The 0-9 pad must not need scrolling or hide the game.

## Tasks

- [x] T1 (S3) router, test first - inline (RED observed, then GREEN)
- [x] T2 (S1) tokens, shared badge, catalogue, library screen - inline
- [x] T3 (S2) play screen, keypad, key forwarding - inline
- [ ] T4 (S1-S3) browser check: desktop and Pixel 7 emulation passed in Chromium (not committed); the owner's phone is pending
- [x] T5 (S4) i18n (test first for language detection), keypad tray replaces the D-pad - inline

## Log

L1 (2026-10-22): "la 2, biblioteca y pantalla de juego" (option 2 offered by Claude: "Biblioteca y pantalla de juego reales: reemplazar el título y el iframe pelados por el diseño de Pixelito.").
- L6 (owner, 2026-10-22, after phone test): "el pad numero hay que hacer scroll para verlo tanto en mobile como en desktop y en el telefono le daba para arriba y no se movia el bichito". Fixed the scroll (page fits the viewport). The Up-arrow failure did not reproduce with 90 ms touches in Pixel 7 emulation; to retest on the phone.
- L7 (owner): "ojo y tenemos que tener i18n veo todo en ingles" / "español e inglés, espaniol por defecto, mucho cuidado con la interfaz tiene que ser muy amigable vi que el pad salia arriba".
