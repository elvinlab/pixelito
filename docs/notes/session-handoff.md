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

## Uncommitted experiment (working tree)

`keys.ts` (`expandKey`: Enter sends Enter and Digit5), its tests, and a wrapper in `PlayScreen.tsx`. It was the owner's request ("que el OK mande también el 5"), then measured as double-advancing screens. Recommended instead: a **per-game control profile** in the catalogue (Rally = 5, GAEM = Enter). The owner has not decided. Either commit the profile or drop the experiment (`git checkout -- src/features/play`).

## Owner pending

- Remove the firewall rule: `sudo ufw delete allow from 192.168.1.0/24 to any port 5173,5174 proto tcp`.
- Decide: per-game control profile vs sending both keys.
- Phase 0 leftovers: name and trademark checks (task 10), backend vendor (task 11), device benchmarks (task 14), LICENSE holder, contact mailbox, CheerpJ email (do not send without an explicit yes).
- Deferred: reduce the ~10 s game load time (headline gap), self-hosted fonts, saves export/import in the emulator fork, moving the emulator to its own repo.
