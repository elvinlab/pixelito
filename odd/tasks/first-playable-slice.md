# First playable slice

Objective: a J2ME game (GAEM) running inside the app, on a phone. Branch: develop. Runner: none yet (typecheck + build). No push without an explicit yes.

## Specs

- S1: Vite + React + TypeScript SPA with pnpm; `minimumReleaseAge: 10080`; TypeScript strict; product name in one config place.
- S2: The emulator (`zb3/freej2me-web` clone) is served from a separate origin and loaded in an iframe.
- S3: A bridge on the emulator origin receives `pixelito-protocol` messages and feeds keys to the game.
- S4: Test on a real phone and record the load time.

## Tasks

- [x] T1 (S1) skeleton - inline. `pnpm check` and `pnpm build` pass (observed). Biome 2.5.15, TypeScript 7.0.2, Vite 8.3.4 added; not committed
- [ ] T2 (S2) local emulator + iframe - inline
- [ ] T3 (S3) bridge - inline
- [ ] T4 (S4) phone test - needs the owner's phone

## Log

L1 (2026-10-22): "sí, arrancá con el esqueleto" (after "no gates, no paperwork; start the core").

L2 (2026-10-22): "biome, typescript strict y clean code moderno escalble"; "biome, doucmentacion de codigo etc etc". Done: Biome, strict TS, TSDoc and README Development section.
