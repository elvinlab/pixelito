# Phase 0 plan — Research and prototypes

- **Status:** Provisional
- **Date:** 2026-10-22
- **Goal:** Prove that playing is worth it, and decide the open technical questions with evidence, before building the product.
- **Next step:** Performance investigation is **parked on purpose** (timebox spent; findings and open questions are in [docs/notes/freej2me-web.md](notes/freej2me-web.md): Chromium 1.2 s warm, Firefox about 4.5 s even warm, phone and slow network unmeasured, Firefox cache cause unproven). Revisit with a real prototype and a phone. Task 6 first pass is done (a real game wrote `SAVE0`, it survived a full browser restart in Chromium and Firefox; see [docs/notes/freej2me-web.md](notes/freej2me-web.md)). Task 5 first pass is done: a cross-origin bridge prototype passes 9 of 9 checks in Chromium and Firefox, with a sensitivity control (see [docs/notes/bridge-protocol.md](notes/bridge-protocol.md)). Task 9: Frozen MIDlet read from the owner's download (two source-only games with mixed GPL/Apache headers, not catalogue-ready; see [docs/notes/demo-games.md](notes/demo-games.md)); remaining for task 9: Kakuro terms and author permissions. Task 13 first pass is done (visual direction and tokens, see [docs/notes/visual-direction.md](notes/visual-direction.md)); next there are the loading, notification, profile and login screens to design. Now: task 5 follow-ups (export and import of saves with bytes: outside read and write worked once in a prototype but is fragile, so build it Java-side in the fork; key repeat), then task 7 (input) or task 10 (name).
- **Done (2026-10-22):** second real-game run with `GAEM.jar` (426 KB, GPLv2 or later per its source headers): runs on both browsers, game start 1.2 to 2.3 s on Chromium and 4.4 to 5.2 s on Firefox, independent of jar size.
- **Postponed by the owner (2026-10-22):** Task 3, the email to Leaning Technologies. Groundwork and the four questions are in [docs/notes/cheerpj-licensing.md](notes/cheerpj-licensing.md). Revisit before any public launch or growth push.
- **Done:** Task 1 and 1b (saves live in CheerpJ's `/files`, export is all-games-only, no save or start events). Task 2 on desktop browsers (no COOP/COEP needed, `COEP: require-corp` breaks it, iframe needs `allow-same-origin` on a separate origin, `/files` persists across reload). Details in [docs/notes/freej2me-web.md](notes/freej2me-web.md). Not covered: a real game, mobile browsers, storage eviction.

## Experience criteria (acceptance for the prototype)

- **Speed is a headline requirement** (owner priority). Two separate budgets, because they have different bottlenecks:
  - *App shell* (library, profile, navigation): instant-feeling, small JavaScript, cached for repeat visits. Same style of CI gates as `elvinlab.dev` (bundle size and Lighthouse thresholds), numbers fixed after the first spike.
  - *Starting a game* (CheerpJ plus the jar): the heavy part. Measured baseline, 2026-10-22, desktop headless Chromium and Firefox, warm network: the emulator launcher took **6 to 7 seconds** to become usable (no game started). That is not "super fast"; it is the main performance risk of the project. Ideas to test, in order of cost: start loading the runtime while the user browses the library, cache the runtime for repeat visits, show the console UI and a boot animation immediately, and measure on a mid-range phone. Record every number; do not hide a slow start behind promises.
- Responsive from phone to desktop.
- Fast first load and instant-feeling navigation.
- Installable as a PWA, fullscreen, UI shell usable offline (the emulator itself needs a connection because of CheerpJ).
- Feels like a native app: smooth transitions, controller-friendly navigation, optional sound, reduced-motion support.
- Modern dark console look with light 8-bit details; contrast AA minimum.
- Numeric targets (FPS, input latency, time to first play) are set after the first benchmarks, on a mid-range Android phone and a desktop without a strong GPU.

## Tasks

| # | Task | Output |
|---|---|---|
| 1 | Read `github.com/zb3/freej2me-web`: RMS storage, exposed events, CheerpJ version, embedding parameters | Notes on what the bridge can rely on |
| 2 | Test in Chrome and Firefox whether CheerpJ needs COOP/COEP; check effect on OAuth popups | Header requirements for the emulator origin |
| 3 | Email Leaning Technologies about a free hosted service with an optional paid tier | Written answer |
| 4 | Prototype comparison: Next.js vs Vite SPA as an installable PWA (load time, navigation feel, offline shell) | Recommendation with measurements. First pass (size only): [docs/notes/stack-spike.md](notes/stack-spike.md), Vite 69 KB gzip vs Next 178 KB for the same trivial UI; both work offline with a trivial service worker; Lighthouse, install and devices not measured |
| 5 | Emulator bridge: versioned `postMessage` protocol with origin validation (load, suspend, resume, volume, save, events) | Protocol draft + working demo |
| 6 | Local saves in IndexedDB: per-game records, export and import | Prototype + reliability notes |
| 7 | Input: keyboard, touch keypad overlay, Gamepad API, per-game remapping. Idea source: three schemes (Classical, Modern, Pro) and a live controls test screen, see [docs/notes/roylays-plays.md](notes/roylays-plays.md) (ideas only, no code copied) | Control scheme per device. First pass: [docs/notes/input.md](notes/input.md) (what the emulator already supports, proposal untested) |
| 8 | Compatibility labels (playable / partial / broken) and a screenshot smoke test | Criteria + test harness idea. First pass: [docs/notes/compatibility.md](notes/compatibility.md) (proposed labels; smoke test ran on GAEM and PacMan in Chromium, input check was weak and is to be fixed) |
| 9 | Verify exact licences of candidate demo games (e.g. PacMan J2ME, POTG Games, Frozen MIDlet) | Table of titles and licences |
| 10 | (Owner chose to keep **Pixelito** on 2026-10-22; remaining: registrar and trademark checks on that name by a human, see [docs/notes/name-check.md](notes/name-check.md)) Name check. Confirm `pixelito.app` at a registrar and search trademarks. Also evaluate the owner's idea `j2mePixelito` (to stand out from the many "pixel" and "retro console" names) plus 2 or 3 alternatives, each with domain availability and a trademark search. Include whether "J2ME" or "Java" in a product name risks an Oracle claim (unverified), and weigh it against keeping "J2ME" only in the tagline and SEO | Decision on the name, with the evidence per candidate |
| 11 | Read Supabase terms for commercial use of the free plan; decide on keep-alive. Owner dislikes the pause risk; alternatives compared in [docs/notes/backend-options.md](notes/backend-options.md), vendor decision deferred to a post-Phase-0 spike. First pass done: [docs/notes/supabase-terms.md](notes/supabase-terms.md) (nothing forbids or allows it; keep-alive unaddressed; Acceptable Use Policy and pricing FAQ unread) | Note in ADR |
| 12 | Draft plain-language terms and privacy notice, plus a copyright contact. First drafts written 2026-10-22: [terms](drafts/terms.md), [privacy](drafts/privacy.md); open points for a lawyer listed in each; `[CONTACT]` address still to create | Drafts for the beta |
| 13 | Visual direction: logo, palette, pixel-art trophy style, slogan options | Mood board and tokens. First pass 2026-10-22: [docs/notes/visual-direction.md](notes/visual-direction.md) (palette and type from the `elvinlab.dev` brand with computed contrast, console layouts for phone and desktop, planned flows); `PRODUCT.md` at the repo root. Mocks are in a private canvas; logo, trophy art and slogans not done; owner review of `PRODUCT.md` pending |
| 14 | Benchmark on target devices | Measured FPS, latency, load time |
| 15 | Measure verification timings of the first pipeline against the ADR 0002 budgets (T0 to T3) | Timings recorded; budgets adjusted or fixed. First data point 2026-10-22: `pixelito-protocol` CI (GitHub Actions, Node 24, no install step, 17 tests) ran green in **8 s** wall clock on `develop`; actions pinned by commit SHA; no branch protection yet; the app monorepo has no CI |
| 16 | Set up `pixelito-protocol` (MIT) with the versioned schema and contract tests | Shared package consumed by app and emulator host. First pass: local folder `../pixelito-protocol` (not a git repo yet): zero dependencies, 17 contract tests pass, 5 of 5 deliberate breakages caught; not yet consumed by anything |

## Exit gate

Do not start the social, achievements or billing work until:

1. A `.jar` plays on desktop and Android Chrome at an acceptable measured speed.
2. Local saves survive closing the tab and restoring.
3. The emulator bridge works across origins.
4. CheerpJ licensing has a written answer, or a documented plan if it blocks the model.

If mobile performance fails, launch desktop-first. If it fails on desktop too, reopen the engine decision in ADR 0001.
