# Notes — `zb3/freej2me-web` (Phase 0, task 1)

- **Date:** 2026-10-22
- **Status:** Two passes. The first table came from web fetches (model-written summaries); the section "Confirmed against a clone" was read from a local shallow clone and supersedes it where they differ (nothing contradicted so far).
- **Files read:** README, `LICENSE`, `web/run.html`, `web/src/main.js`, parts of `web/src/launcher.js`, `src/pl/zb3/freej2me/launcher/LauncherUtil.java`. **Not read:** the rest of `src/`, `web/libjs`, `web/libmedia`, `web/libmidi`, `web/init.zip`, `freej2me-web.jar` (binary).
- **Local clone:** kept in the session scratch directory for tasks 2 and 5; disposable, re-clone if missing.

## What was found

| Topic | Finding | Implication for Pixelito |
|---|---|---|
| Licence | GPLv3 (FreeJ2ME) plus an ObjectWeb ASM BSD-style licence for a dependency | Matches ADR 0001: the fork is public under GPLv3 |
| CheerpJ | `run.html` loads `https://cjrtnc.leaningtech.com/20260317_2978/loader.js` from Leaning Technologies' CDN. The version is a dated build, not "CheerpJ 2" by name | The emulator page depends on a third-party script: the emulator origin's CSP must allow that host. The earlier worry about a deprecated CheerpJ 2 may not apply; confirm which major version that build is |
| Embedding | Documented form: `run.html?app=<id>`, optional `fractionScale`. Iframe size should match the game screen or a multiple of it | Fits the isolated-iframe design |
| URL parameters read | `app`, `jar` (defaults to `game.jar`), `fractionScale` (persisted in `localStorage`), `mobile` | Our host must pass only values it generated. `app` and `jar` are concatenated into paths without validation, so never forward user-controlled strings |
| Loading a game | `app` path installs from a bundled zip under `apps/<id>.zip`. Otherwise the game is read from `/jar/<name>` | There is no visible "user drops a file" path in `main.js`; the launcher UI handles it somewhere not yet read. To confirm |
| Messaging | No `postMessage` and no `message` listener anywhere in `run.html` or `main.js` | The bridge does not exist. We must add it in our public fork, which is allowed because the fork is GPLv3 |
| Hooks that do exist | Same-origin globals `window.evtQueue` (accepts `keydown`, `keyup`, `pointerpressed`, `pointerdragged`, `pointerreleased`, `player-eom`, `player-video-frame`), `window.libmidi`, `window.libmedia` | Input can be injected from a small script inside the emulator origin. Our bridge script would translate protocol messages into these events |
| Save data (RMS) | Not handled in `main.js`. Persistence lives on the Java side. `main.js` only stores the zoom preference in `localStorage` | Unknown where RMS lands and whether it can be exported. This is the next thing to read |
| Export | The README mentions "Export Data" from the launcher, producing the per-game zip | An export exists at least as a UI feature; it may be the path to host-owned saves |
| COOP / COEP | Not mentioned in the README, `run.html` or `main.js`. No use of `SharedArrayBuffer` or `crossOriginIsolated` in `main.js` | Good sign, not proof. Task 2 tests it in real browsers |
| Server needs | The README asks for `Range` header support | Our emulator origin must serve with range requests |
| Build | Docker image plus `ant` for the JAR; shell scripts rebuild two WASM modules (media transcode, MIDI) | Building the fork is a separate task with its own cost |
| Hosting | The README tells you to self-host the `web` directory | Self-hosting the emulator page is supported by the project. Whether self-hosting plus CheerpJ's CDN loader fits CheerpJ's terms is still the question for Leaning Technologies (task 3) |

## Security observations

- The `app` and `jar` values are not sanitised before being joined into paths. Inside a sandboxed, cookieless iframe the risk is contained, but the host page must never build these from user input.
- `main.js` contains `debugger;` statements in two debug natives. Harmless, but remove them in our fork.
- Loading `loader.js` from a third-party CDN means a change on their side runs inside our emulator origin. The sandbox (no `allow-same-origin`, no tokens, no cookies) is what limits that; pinning the dated path in the URL helps, because the build cannot change underneath us.

## Confirmed against a clone (task 1b)

Shallow clone of the default branch at commit `c19416e` (2026-03-23, message "Use newer CheerpJ version to fix UTF-8 file names bug"), read with grep and sed only, nothing executed. 502 Java files under `src/`, of which the ASM library accounts for many.

| Question | Answer (read from source) |
|---|---|
| Where is save data kept? | In CheerpJ's `/files` mount, which is the Java working directory. Each game gets a directory named by its app id: `<appId>/app.jar`, `<appId>/rms` (the RecordStore data), `<appId>/config/*.conf`, `<appId>/name`, `<appId>/icon`. A top-level `apps.list` orders the library. Source: `LauncherUtil.java` (`wipeAppData`, `uninstallApp`, `moveAppIdToTop`) and `launcher.js` (reads `/files/<appId>/...`) |
| Can saves be exported without the launcher UI? | Not through a public hook. `LauncherUtil.exportData()` zips the **whole** `/files` directory and `importData()` replaces it. Both are called only from the launcher page (`doExportData`, `doImportData`). Export is all games at once, not per game |
| How does a user's `.jar` get in? | The launcher page has file inputs read with `FileReader`; the bytes are written to `/files/_tmp/<n>.jar`, then installed under an app id. The file never leaves the browser, which matches ADR 0001 |
| CheerpJ version | `cheerpjInit` is called with no version option. The runtime is whatever the dated CDN path serves (`20260317_2978`). The maintainer bumped it on 2026-03-23 for a file-name bug, so the project tracks CheerpJ updates. Still unknown: the major version number and current licence terms (task 3) |
| Is the host able to tell when a game starts or a save is written? | No. There are no such events. `Shell` natives (`setTitle`, `setIcon`, `setCanvasSize`, `exit`, `restart`) are one-way from Java to the page and `setCanvasSize` happens when the first frame size is known, so it is a usable "game started" signal. "Save written" does not exist |
| Upstream attitude to CheerpJ | The README says CheerpJ is proprietary, needs an internet connection and is "a little slow", and that porting to another VM is possible but not planned. The project deliberately avoids CheerpJ's AWT GUI and wasm JNI modules |

### What this means for Pixelito

- **Saves are not host-owned today.** They live inside CheerpJ's storage, bundled with every other game. ADR 0002's `SaveStore` port needs a bridge feature in our fork: per-game export and import of `<appId>/rms` over the protocol. This is the first real piece of work in task 5, and it should be a small Java-side addition plus a JS wrapper, both in the public fork.
- **"Save written" for sync and achievements** needs a new signal. Cheapest candidate: have the bridge export the game's `rms` directory when the game is suspended or closed (and on a timer), instead of hooking every write.
- **"Game started" and playtime** can come from `setCanvasSize` and `exit`/page lifecycle, with no Java changes.
- **Library metadata** (`name`, `icon`, `apps.list`) is stored beside the saves. The host should keep its own library and treat the emulator's directory as a cache.

## Task 2 results: headers, sandbox and storage (measured)

Setup: the launcher page (`web/index.html`) of the clone served from `127.0.0.1` with a small static server that supports `Range`, two emulator origins (plain headers, and with `COOP: same-origin` + `COEP: require-corp`) and a third origin hosting an iframe. Playwright 1.64.1 with its Chromium and Firefox builds, headless, fresh browser context per case. CheerpJ loaded from its real CDN. Time to the launcher being usable was 6 to 7 s in every working case. No game was run: no `.jar` was available (task 9).

| Case | Chromium | Firefox |
|---|---|---|
| 1 Direct, plain headers (`crossOriginIsolated` was `false`) | works | works |
| 2 Direct, `COOP` + `COEP: require-corp` | **fails** (never ready) | **fails** |
| 3 Iframe `sandbox="allow-scripts"` (opaque origin) | **fails** | **fails** |
| 4 Iframe `sandbox="allow-scripts allow-same-origin"`, cross-origin | works | works |
| 5 Iframe without sandbox, cross-origin | works | works |
| 6 Import a zip into `/files`, reload, entry still there | works | works |

What the failures say:
- **Case 2:** Chromium reports `ERR_BLOCKED_BY_RESPONSE` for `https://cjrtnc.leaningtech.com/.../c.html`. With `COEP: require-corp`, CheerpJ's helper frame from its CDN is blocked. So the emulator origin must **not** send `COEP: require-corp`, and therefore cannot be cross-origin isolated. CheerpJ does not need isolation (case 1 runs with `crossOriginIsolated === false`).
- **Case 3:** CheerpJ posts a message to its helper frame with a fixed target origin, and under `allow-scripts` alone the page's origin is `null`, so the browser rejects it (`Failed to execute 'postMessage' ... does not match the recipient window's origin ('null')`). Browser storage is also unavailable to an opaque origin. The page then waits forever and prints nothing else.
- **Storage:** `/files` is an IndexedDB database named `cjFS_/files/`. It persisted across a reload in both browsers. Not tested: eviction, "clear site data", private windows, mobile browsers, storage quota.

### Decisions this forces

- ADR 0001 and 0002 said `sandbox="allow-scripts"` **without** `allow-same-origin`. That does not work with CheerpJ. The replacement: the emulator iframe uses `sandbox="allow-scripts allow-same-origin"` **and** lives on a different origin from the app, so "same origin" means the emulator's own origin, never the app's. The isolation then rests on the origin boundary: no cookies on the emulator origin, no tokens passed in, the protocol validating `event.origin` and `event.source`, and a strict CSP. Do **not** add `allow-top-navigation` or `allow-popups-to-escape-sandbox`.
- The emulator origin sends no `COEP`/`COOP`. The app origin is free of this constraint, so OAuth popups on the app are unaffected by the emulator.
- Resolved ADR 0001 unverified item 3: CheerpJ does not require COOP/COEP in either browser; it breaks if `COEP: require-corp` is set.
- Because the emulator keeps its saves in its own origin's IndexedDB, they are only reachable from the emulator origin. That strengthens the case for the per-game export bridge from task 5.
- Whether a *subdomain* of the app's registrable domain is acceptable as the emulator origin (cookie scope, "same-site" requests) or a separate domain is cleaner is open. Cheapest safe default: a separate registrable domain, decided before launch.

## First real-game test: `pacman.jar` (measured 2026-10-22)

Same setup as task 2 (local server, real CheerpJ CDN, headless Playwright, desktop, fresh browser context). The jar was added through the launcher's file input, then opened through its `run?app=<id>` link. The launcher also ships two bundled demo games (`k4kur0`, a Kakuro puzzle, and `Connect4`); their licences are not checked. A first run of the test played `k4kur0` by mistake (it picked the first link); the numbers below are from the corrected run that selects the installed game.

| Measure | Chromium | Firefox |
|---|---|---|
| Launcher usable, cold | 7.0 s | 5.9 s |
| Jar analysed and ready to add | 0.2 s | 0.2 s |
| Navigate to game until the canvas is visible, first time (runtime already in the browser cache from the launcher visit) | 2.2 s | 5.0 s |
| Same, repeat visit | 1.3 s | 5.3 s |
| Canvas size | 240 × 320 | 240 × 320 |
| Reacts to keyboard input | yes | yes |
| Page errors | none | none |

- The game starts and accepts input in both browsers. "Reacts" means the canvas pixels changed after `Enter` and an arrow key; it also changes without input, so this is weak proof of responsiveness.
- **Chromium benefits from caching, Firefox did not** in this setup (5.0 s then 5.3 s). The cause is unknown; do not assume Firefox is simply slower on a real user's machine.
- A cold visit costs about 7 s for the launcher plus about 2 s for the game. For a product whose headline is speed this confirms the runtime load as the main risk, with a repeat-visit cost that is good on Chromium and unconfirmed elsewhere.
- **Not measured:** input latency, frame rate, memory, a mid-range phone, a slow network, the true cold start of a game page opened straight from a link.

### The "vanishing game" was a test bug; a real quirk found instead

- **Resolved:** the earlier report that an installed game disappeared after playing was an error in my test script. Its `ready()` helper waited on the first page instead of the page being checked, so the check ran before the library had rendered. Fourteen isolated scenarios on Chromium (install, then play in another page with the first page open or closed, with and without keyboard input, once or twice, short or long, waiting 0, 3 or 10 seconds) all kept the installed game. So no evidence of two pages overwriting each other. **Not covered:** Firefox in these scenarios, truly concurrent writes (two pages writing at the same moment), and a game that saves RMS data (`pacman.jar` may not use it).
- **Real quirk (scenario S4):** with nothing installed, opening a bundled game straight from its link (`run?app=k4kur0`) and *then* opening the launcher showed only that game; `Connect4` was gone. Cause, read from `launcher.js`: the launcher seeds the library from `init.zip` only when `/files/apps.list` does not exist (lines 103 to 110). The play page creates that file for the one game it starts, so the seeding never happens afterwards.
- **Consequence for Pixelito:** the host must not depend on the emulator's own library. Always seed or manage the library from our side (the plan already says the emulator's directory is a cache), and never let a game page be the first thing that touches `/files` on a fresh browser profile, or make sure our bridge initialises it first.
- The bundled demo games (`k4kur0`, `Connect4`) and `init.zip` contents (111 KB, 18 files) have unchecked licences. Added to the task 9 list.

## Second real-game test: `GAEM.jar` (measured 2026-10-22)

Same setup. `GAEM.jar` (426,073 bytes) was added through the launcher; the launcher did not ask for the `.jad` (it read the app id from the jar). It rendered a top-down snow scene with a character and an "Options" soft key on a 240 × 320 canvas, so it is a real game running, not just a blank canvas. A repeat check of the library after playing found the game still installed in both browsers (this run used the corrected `ready()` helper).

| Measure | Chromium | Firefox |
|---|---|---|
| Launcher usable, cold | 6.8 s | 6.0 s |
| Jar analysed | 0.23 s | 0.26 s |
| Game canvas visible, visit 1 / 2 / 3 | 2.3 s / 1.2 s / 1.3 s | 4.6 s / 4.4 s / 5.2 s |
| Reacts to keyboard input | yes | yes |
| JS heap (Chromium only) | 73 MB | not available |
| Page errors | none | none |

- **Jar size is not the driver.** A 15 KB jar (`pacman.jar`) and a 426 KB jar start in about the same time in each browser. The wait is the CheerpJ and VM start-up, not loading the game.
- **Firefox is consistently 3 to 4 times slower than Chromium to show the game** (about 4.5 s against 1.2 s on repeat visits) in this headless desktop setup, and it does not speed up on repeat. Cause unknown. Since speed is a headline requirement, finding where those seconds go in Firefox (network, WebAssembly compile, runtime start) is worth a spike.
- **Not measured:** frame rate, input latency, a phone, a slow network, a true cold visit straight to a game link. "Reacts to input" remains a weak check (canvas pixels changed).

## Performance spike: where game start-up time goes (measured 2026-10-22)

Instrumented the game page (`run?app=GAEM`) in both browsers: console timing, a state poll of the loading element and a log of every network request (headless desktop, localhost server, real CDN). One run each, so treat the numbers as indicative.

| | Chromium visit A | Chromium repeat | Firefox visit A | Firefox repeat |
|---|---|---|---|---|
| Game visible | 4.2 s | 1.5 s | 5.2 s | 5.8 s |
| "CheerpJ runtime ready" log | 0.65 s | 0.2 s | 0.75 s | 0.74 s |
| Requests (CDN / local) | 92 / 23 | 92 / 23 | 92 / 24 | 92 / 24 |
| Summed CDN request time | 6.6 s | 1.2 s | 7.8 s | 9.2 s |

What the data says:
- **Start-up is network-bound on CheerpJ's own files, not on our game.** About 92 requests go to Leaning Technologies' CDN, about 80 of them `Range` slices (128 KB to 1.8 MB each) of `jre/lib/rt.jar`, a 26.9 MB Java class library. Our game and the launcher files are about 23 local requests that finish in around 0.1 s in total. That matches the earlier finding that jar size does not matter.
- **Chromium reuses those slices on a repeat visit** (summed CDN time falls from 6.6 s to 1.2 s). **Firefox does not**: repeat time and summed CDN time are as high as the first visit. Firefox shows the runtime as ready at 0.75 s, then spends about 4.5 s fetching slices before the first frame.
- **Hypothesis, not proven:** Firefox does not serve partial (`206`) responses from its HTTP cache, while Chromium does. The CDN headers are cache-friendly (`cache-control: max-age=31536000`, `etag`, served from Cloudflare cache, CORS and cross-origin resource policy open), so the server side is not the cause.
- **The first Chromium visit was 4.2 s here against 2.2 s in the earlier run.** Run-to-run variance is large, or the instrumentation costs time. Do not quote a single number.

Ideas, ordered by cost, none tested yet:
1. ~~**A service worker on the emulator origin that stores the CDN's slices itself**~~ **Tested 2026-10-22, does not work.** A service worker on our origin (Cache API, keyed by URL and byte range) controlled the page in Chromium but saw only 6 of 92 CDN requests (the loader and the wasm files). A request log by frame shows why: the 155 `Range` slices of `rt.jar` come from an iframe at `https://cjrtnc.leaningtech.com/<build>/c.html`, which is a different origin from ours, so our service worker never sees them. Start time did not improve (about 4.4 s with the worker against 2.5 to 4.2 s without; high variance). In Firefox the page was not controlled after reload in the one run, so that half is untested. Dead end unless the runtime files are self-hosted (idea 3), which would put `c.html` under our origin.
2. **Warm the runtime while the user browses the library** (fetch the same slices in the background), so the click on "play" finds them cached. **Tested 2026-10-22 in two rounds; the first round was wrong and is withdrawn.**

   *Withdrawn:* an earlier table (cold about 7 s, warm 3.8 to 5.0 s, throttled 34 to 39 s) used `run?jar=<URL>`. The `jar` parameter is a path inside CheerpJ's `/app/jar` mount, not a URL: every run threw `FileNotFoundException: /app/jar/http:/...` and no game loaded. Those numbers measure only runtime start-up plus an error screen, and the remark that loading a jar from a URL costs extra was a false lead. Treat them as runtime-only, not as game start. The throttled figures (34 to 39 s) still say how slow the runtime download is on 4 Mbit/s with 100 ms latency, but they were not a game start either.

   *Valid round* (game installed in `/files` through the launcher, then opened in a new tab as `run?app=GAEM`, headless desktop, real CDN, three visits each; request durations from Playwright `timing()`):

   | | Visit 1 (after install) | Visits 2 and 3 | CDN requests per visit | Median request |
   |---|---|---|---|---|
   | Chromium | 2.2 s | 1.2 to 1.3 s | 91 to 92 | 1 ms (cache), summed about 80 ms |
   | Firefox | 4.7 s | 4.5 to 4.9 s | 81 | 74 ms every time, summed 6.3 to 7.0 s |

   What it says:
   - **Chromium is fast once warm: 1.2 s.** All slices come from cache (about 1 ms each), so the remaining 1.2 s is CheerpJ starting the Java runtime and the game. Pure network wait is gone.
   - **Firefox pays about 75 ms per CDN request on every visit**, cached or not, 81 requests per start; summed 6 to 7 s over about 4.5 s of wall time. Firefox is network-latency-bound even warm. Cause not proven (candidates: it does not cache partial `206` responses, or revalidates each one).
   - **Warming the launcher first does not fix Firefox**, because its cache is not serving these slices to begin with.
   - Instrumentation matters: listening to every request with extra work per event inflated one Chromium run to 4.2 s. Quote only low-instrumentation numbers.
   - Not measured with a valid game: any throttled network, a phone, and a cold first visit (the install step always warms the cache). A cold first visit and the network test must be redone with the game installed.

3. **Self-host the runtime files** with long cache headers on our own CDN. CheerpJ's page allows self-hosting under commercial licences; for the free tier it is unconfirmed. Ask in the postponed email.
4. **Test on a throttled network and a phone.** If the cost is bandwidth for 12 MB or more, a mid-range phone on mobile data will be much slower than this desktop run.

## Saves that survive: a game that really writes RMS (measured 2026-10-22, task 6 first pass)

GAEM has a save system (`RecordStore` use found in its bytecode; the title menu offers New Game, Load Game, Help, Exit; the in-game menu has "Back to Title"). It writes nothing until played. Soft keys are `F1` (left) and `F2` (right) on the keyboard; a pointer click on the "Options" label does nothing.

Test (Chromium and Firefox, headless, persistent profile in a scratch folder): install the jar from the launcher, open `run?app=GAEM`, choose New Game, walk a few steps, choose Back to Title, list the IndexedDB database `cjFS_/files/` (object store `files`), close the whole browser, reopen it with the same profile, list again, then Load Game.

| Step | Chromium | Firefox |
|---|---|---|
| Before any play | no `/GAEM/rms` | same |
| After New Game and Back to Title | `/GAEM/rms/SAVE0` exists | same |
| After closing and reopening the browser | `/GAEM/rms/SAVE0` still there | same |
| Load Game after restart | a game screen loads | not inspected |

- **Persistence is confirmed in both browsers:** the RMS data is a plain file under the game's folder in the same IndexedDB (`/<appId>/rms/<store name>`), so a save is one record per RecordStore. That answers ADR 0001 unverified item 1 for storage. A per-game export is therefore a matter of zipping `/<appId>/rms/*` plus the game's config, which is what the platform will need.
- **Not proven:** that Load Game restores the exact state. After loading, the player sat at a different screen position from before saving, and the map camera may explain it; I did not compare game state. Needs a game with a visible score, or a decoded save file.
- **Not covered:** storage eviction, private windows, concurrent tabs writing the same RecordStore, Android Chrome, and the `rms` of a game with several stores.
- **Method lesson:** playing a game blind through screenshots is slow. For later tests prefer a game with a plain "save" or high score, or call the RecordStore directly through a small test MIDlet we own.

## Open questions for the next read

1. Are CheerpJ's `/files` contents stored in IndexedDB, and what happens on eviction, private mode or "clear site data"? (Task 2 and task 6 test this in real browsers.)
2. Which CheerpJ major version is build `20260317_2978`, and what are its licence terms today? (Task 3.)
3. How hard is a per-game RMS export from the Java side? Read `MIDletLoader` and `RecordStore` implementation to see where the files are opened.
4. Can the emulator page run with `sandbox="allow-scripts"` and no `allow-same-origin`? CheerpJ and `/files` may need storage access that an opaque origin forbids. This decides whether "separate origin" can also be "sandboxed". Highest-risk question for the architecture.

## Consequences for the plan

- ADR 0001 unverified item 2 (CheerpJ version) is partly answered; item 3 (COOP/COEP) leans "not required" but is still unconfirmed; item 1 (RMS and events) is half answered: events yes, RMS no.
- Task 5 (bridge) is now concrete: a small script in the fork that listens for protocol messages and feeds `window.evtQueue`, and posts lifecycle and save events out.
- No blocker found for the isolated-iframe design.

## Warm-up mode (2026-10-28)

Measured in headless Chromium against a local emulator server: a cold first game takes about 8.5 s, of which about 13.6 MB is the CheerpJ runtime from its CDN (cacheable for a year); with every cache warm it takes about 1.4 s.

- **Fork change (local only, in `web/src/main.js`, uncommitted with the rest of the fork):** after `const FreeJ2ME = await lib.org.recompile.freej2me.FreeJ2ME;`, `if (sp.get('warmup')) { window.parent.postMessage({ pixelitoWarmup: 'done' }, '*'); return; }`. It starts the runtime and the library jar without launching a game. **An emulator without this change would start its default game instead**, so deploy the emulator first.
- **Pixelito side:** `EmulatorWarmup` (`src/features/play`) mounts a hidden frame on the library screen when the browser is idle, skips it when `saveData` is on or the connection is `3g` or slower (`shouldWarmUp`), and removes the frame on the `done` message from the emulator origin or after 60 s.
- **Result (end to end, same machine):** first game 8.7 s without the library visit, 4.1 s after the warm-up finished. The remaining time is the part of the JRE that only downloads when Java code runs.
- **Open:** warming the JRE chunks too (would need running a trivial class), and measuring on a real phone and network.

## Where saves live (2026-10-28)

Observed in headless Chromium after playing Rally Master Pro up to the name screen: the emulator origin has one IndexedDB database, `cjFS_/files/`, with a `files` store of 14 keys, among them `/Rally Master Pro/rms` and `/Rally Master Pro/rms/FL_RMP_OPT`. So **the game's saves (J2ME record stores) already persist between sessions in that browser**, keyed by the game's own name, with no change to the fork.

- **Limits:** they belong to the emulator origin and that browser. Clearing site data, another browser or another device loses them, and Pixelito cannot see, export or import them yet.
- **Not decided (needs the owner, and a change to the protocol and the fork):** an export/import path. A sketch: a protocol message pair `saves-export` and `saves-import` handled in `pixelito-bridge.js`, reading and writing that IndexedDB store directly. Import must happen before a game starts, because CheerpJ may hold files in memory while it runs. The same path would later feed cloud sync. The profile screen's "export saves" (see `visual-direction.md`) depends on it.
- **Not verified:** that two different games never collide on keys (the key starts with the game's own name, taken from the jar), and the behavior when the same jar is renamed.

## Preloading the JRE (2026-10-28)

CheerpJ's `preloadResources` option fetches the runtime pieces a start needs up front and in parallel, instead of one range request at a time while Java runs. The list is what `cjGetRuntimeResources()` returns after a real start (saved here as `emulator-preload-resources.json`, 51 ranges of `rt.jar` plus a few small jars, for the CheerpJ build the emulator pins).

- **Fork change (local only, `web/src/main.js`):** before `cheerpjInit`, `const preloadResources = await fetch('./preload-resources.json').then(r => r.json()).catch(() => ({}));` and pass `preloadResources` in the options. The file goes in `web/` next to `run.html`.
- **Measured (headless Chromium, local emulator server, CheerpJ CDN over the real network):** cold first game 8.7 s before, **5.0 s** with it (three cold runs: 4.7, 5.1, 4.8 s). Combined with the library warm-up: **2.5 s**, against 4.1 s with the warm-up alone.
- **Caveats:** the list was taken from GAEM only. A game that touches other JRE classes still fetches those on demand. The list is tied to the CheerpJ version in use; regenerate it when the emulator moves to a new CheerpJ build (a stale list fetches pieces that are not needed, which wastes data but does not break). Not measured on a real phone.
