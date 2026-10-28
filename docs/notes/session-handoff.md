# Notes — Session handoff (2026-10-22)

- **Purpose:** pick up in a new session without the chat. Everything here was observed in the session unless marked as a hypothesis.
- **State of `develop`:** commits through the library and play screen, plus the local catalog mechanism. **Nothing is pushed.** Push only when the owner says so.

## How to run the spike locally

1. Emulator (separate repo `pixelito-emulator-scratch`, clone of `zb3/freej2me-web`, local changes uncommitted on purpose): serve `web/` with a static server that supports HTTP Range requests.
2. Pixelito: `VITE_EMULATOR_ORIGIN=<emulator origin> pnpm dev --host`.
3. The emulator accepts messages only from an allowlist of origins in `web/src/pixelito-bridge.js`. The LAN origin used for phone tests is **temporary and must not be committed**.
4. Games live in the emulator's `web/jar/` (git-ignored). The official catalogue is `src/features/library/catalog.ts`. Private test games go in `src/features/library/catalog.local.ts`, which is git-ignored and **must never be committed** (user-supplied commercial `.jar` files stay out of the repo).
5. Checks: `pnpm check` (Biome, `tsc --noEmit`, Vitest).

## Rally Master Pro (user-supplied test game, Mascot Capsule Micro3D v3)

- The first "LOADING" screen is not a hang: the game waits for key **5** ("Press 5 to continue!"). Enter and the arrows do nothing there. After 5: sound menu (Off/On), splash, Main Menu, Choose Rally, help question, Rally Overview.
- The game accepts both Enter and 5 as "accept". Sending both from one OK tap skips two screens. 5 alone does everything Enter does, one screen per press.
- **Open bug (owner report):** a "LOADING" screen with a blank game area and an orange bar about 93% full that never finishes, on the owner's Chrome. Not reproduced in headless Chromium: sound On reaches the Main Menu in about 3 s and stays stable for 50 s. Headless does print `NullPointerException` in `fu.keyPressed`/`fu.keyReleased` ("exception in event handler") when keys arrive while the game loads, and the game recovers.
- **Hypothesis, unverified:** the stuck screen is the loading of a race (after Start and Choose Rally), where Micro3D/WebGL is used, not the sound menu. The owner was asked which screen came right before it and has not answered.
- Next steps: ask which screen preceded the stuck LOADING; if it is the race load, test headed Chrome with a real GPU and check the WebGL errors; inspect `fu` with `javap -p -c`; consider a hint when a game waits for a key.

## Control profile per game (done 2026-10-28)

`Game.confirmKey` (`'enter'` by default, or `'five'`) decides what Pixelito's OK sends. Rally Master Pro uses `'five'` in the git-ignored `catalog.local.ts`; GAEM keeps Enter. The "send Enter and 5 together" experiment was replaced by this, because it skipped two screens per tap.

## Reproduction attempts for the stuck LOADING (headless Chromium, 2026-10-28)

- Full path reached in headless: sound menu, Main Menu, Choose Rally, name entry ("What is your name?"), Rally Overview (bar 100%), Track Overview, the race start gate in 3D, and the in-game help. No hang, with 5 alone or with Enter and 5 together.
- One run froze the page main thread during a screenshot (Playwright timed out at 30 s); the identical run later passed. Intermittent, cause unknown.
- The `NullPointerException` in `fu.keyPressed` and `fu.keyReleased` appears in every run and is harmless there.
- Headed Chromium (real window, GPU rasterization forced, 2026-10-28): same path through Choose Game Mode, name entry and Rally Overview with its help, no hang. So window and GPU rendering alone do not reproduce it; remaining suspects are the owner's audio output and extensions.
- Still open: the owner's Chrome shows a blank game area with an orange bar near 93% and "LOADING", at the sound menu after pressing Start. It likely depends on real GPU or audio. Next: ask the owner for the browser console output (F12) at that moment, and try headed Chrome with a real GPU.

## Blockers found while working alone (2026-10-28)

- **CI added (2026-10-28).** The sibling-folder blocker is gone: `pixelito-protocol` (public) is now a git dependency pinned to a commit, and the alias points into `node_modules`. The workflow is `.github/workflows/ci.yml` (approved by the owner; actions pinned by SHA, pnpm via Corepack, `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`). Bump the pinned commit in `package.json` whenever the protocol changes.
- **Export/import of saves** changes the protocol (a contract) and the fork; see `freej2me-web.md`. Not started.
- ADR 0002 lists CI workflows as protected files: the owner approves them.

## Owner pending

- Remove the firewall rule: `sudo ufw delete allow from 192.168.1.0/24 to any port 5173,5174 proto tcp`.
- Phase 0 leftovers: name and trademark checks (task 10), backend vendor (task 11), device benchmarks (task 14), LICENSE holder, contact mailbox, CheerpJ email (do not send without an explicit yes).
- Deferred: reduce the ~10 s game load time (headline gap), self-hosted fonts, saves export/import in the emulator fork, moving the emulator to its own repo.
