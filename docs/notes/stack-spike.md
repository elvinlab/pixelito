# Notes — Next.js vs Vite SPA (Phase 0, task 4)

- **Date:** 2026-10-22
- **Status:** Second pass (size, then offline and install basics in Chromium). Not a recommendation yet.
- **Method:** two minimal apps built in a scratch directory outside the repo (library list of three titles, two routes, React 19.3.1; Next 16.4.2 with `output: 'export'`; Vite 8.3.5 with `@vitejs/plugin-react` 6.1.2). The first pass used npm and the newest versions; the second pass **redid everything with pnpm 12.6.0** (owner confirmed pnpm, as in ADR 0002) and `minimumReleaseAge: 10080` (7 days) with no dependency build scripts allowed. The guardrail worked: pnpm refused `vite@8.3.5` (published 2026-10-21) and the app was pinned to `8.3.4`. Final versions: React 19.3.1, Next 16.4.2, Vite 8.3.4, `@vitejs/plugin-react` 6.1.2. Release age is not vetting; no changelog or advisory review was done.

## Measured

| | Vite SPA | Next.js static export |
|---|---|---|
| JS needed by the first page (gzip) | **69 KB** (one file, 220 KB raw) | **178 KB** (577 KB raw, 11 JS files in the export; first-pass number with npm) |
| HTML of the first page | 0.26 KB (empty root, content after JS runs) | 5 KB (content already in the HTML) |
| Build time | under 1 s | a few seconds |

Reading: for the same trivial UI, Next ships about 2.6 times more JavaScript on first load, but paints real content before the JS runs. Both numbers will grow with the real app; the framework cost is the fixed part.

## PWA basics (Chromium, headless, localhost, gzip server)

Both apps got the same manifest and the same 7-line hand-written service worker (cache-on-fetch, no plugin).

| Check | Vite | Next (export) |
|---|---|---|
| Service worker controls the page after a reload | yes | yes |
| Manifest found and parsed | yes | yes |
| Offline reload of `/` shows content | yes | yes |
| Offline click from Library to Profile | yes | yes |
| Offline direct visit to `/profile` | failed | failed |

Reading: the shell works offline in both with trivial code. The `/profile` failure is a gap in my test worker, not a framework result: it only caches what was fetched, and for Vite `/profile` is not a real URL at all (the test is unfair to it). Load-time numbers (10 ms and 18 ms warm) came out identical on every run and are tiny because everything is local; **treat them as noise, not a result**. Install prompt and "add to home screen" behaviour were not tested.

## Not measured (do not infer)

Lighthouse scores, real devices and slow networks, hydration cost, the effect of the real UI library, install behaviour, and server features (the Next test used static export, so it does not show what Next adds when it runs a server).

## Considerations that are not numbers

- The app is mostly client-side (emulator iframe, local saves, offline shell, installable), so server rendering buys little for the play screens. It may help public pages (catalogue, game pages, SEO).
- A hybrid is possible later: a static marketing/catalogue site plus a SPA shell. This is a design question, not decided.
- Fewer moving parts and a smaller JS bill fit the "speed is a headline feature" rule, but the Vite side needs a PWA layer (plugin or hand-written service worker) that has to be chosen and vetted.
- Auth and backend are undecided (see `backend-options.md`); the framework choice should not lock them.

## Next

1. Test install behaviour and a proper precache (route-aware) on both.
2. Run Lighthouse and a throttled test on both, on a phone if possible.
3. Re-measure with the real shell once task 7's keypad and the library UI exist.
4. Only then write the ADR line.
