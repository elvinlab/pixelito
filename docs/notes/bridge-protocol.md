# Notes — Emulator bridge protocol v1 (draft, task 5)

- **Date:** 2026-10-22
- **Status:** Draft from a working prototype. Provisional. The real protocol lives in the future `pixelito-protocol` repository (task 16, MIT).
- **Prototype code:** scratch folder outside the repository (not committed). Emulator side was injected into `run.html` by a test server, standing in for the future GPL fork.

## Setup tested

The host page and the emulator page are on **different origins** (different ports on `127.0.0.1`), the emulator in an `<iframe sandbox="allow-scripts allow-same-origin">`, as decided in ADR 0001 and ADR 0002. The emulator library was seeded first on its own origin (the emulator's `/files` is per origin).

## Envelope

Every message is a plain object: `{ pixelito: 1, type: "<name>", ...fields }`. `pixelito` is the protocol version. Anything else is ignored silently.

## Receiving rules (both sides)

- Host accepts a message only if `event.origin` equals the emulator origin **and** `event.source` is the iframe's window.
- The emulator accepts a message only if `event.source` is `window.parent`, `event.origin` is in a **fixed allowlist compiled into the bridge** (never read from the URL), and the envelope is valid. The reply is sent with that exact target origin, never `*`.
- Unsupported version or malformed envelope: ignored, no reply.

## Messages in v1

| Direction | Type | Fields | Meaning |
|---|---|---|---|
| emulator → host | `ready` | `capabilities: string[]` | The bridge is listening. Also sent as the answer to `hello` |
| emulator → host | `started` | `width`, `height` | The game is drawing (the loading element was hidden by the Java side's canvas-size call) |
| emulator → host | `saves` | `id`, `files: [{path}]` | Answer to `list-saves`: RMS files under `/<appId>/rms/` |
| emulator → host | `error` | `code` | `unknown-type` or `bad-key` so far |
| host → emulator | `hello` | | Ask for `ready` |
| host → emulator | `key` | `action: "down"\|"up"`, `code` | Press or release a key. `code` must be one of the emulator's known key codes (F1 and F2 are the soft keys) |
| host → emulator | `list-saves` | `id` | List RMS files |

Not built yet: `load`, `suspend`, `resume`, `volume`, `export-saves` and `import-saves` with file contents, pointer events, error reporting for crashes, key repeat (the prototype sends raw down and up, bypassing the emulator's key-repeat helper).

## Evidence (9 checks, Chromium and Firefox, headless)

All passed in both browsers: ready from the right origin; started with a 240×320 canvas; `hello` answered; `key F1` from the host opens the Options menu (screen changes); a message from a **different origin** does not change the screen; a spoofed message posted by the host to itself is ignored; unknown message type and an invalid key code return typed errors; an unsupported protocol version is ignored; `list-saves` returns `/GAEM/rms/SAVE0` after the game wrote it.

**Sensitivity control:** with the other origin added to the allowlist, the "other origin is ignored" check **fails** (8 of 9), so that check does measure the rule.

## Findings

1. **Cross-origin iframe with `allow-scripts allow-same-origin` works for bidirectional messaging** and for driving the game with synthetic key events through `window.evtQueue`. No change to CheerpJ was needed.
2. **"Game started" is observable** without touching Java: the loading element's `hidden` attribute changes. It is the same signal the launcher uses.
3. **Saves are listable from the bridge** by reading the emulator origin's IndexedDB. Exporting contents is the next step; per-game export needs the file bytes, not just paths, and should be built in the fork to avoid reaching into CheerpJ's storage format from outside.
4. **Security note:** an allowlist of one host origin was enough to stop another page from driving the game. This is about message handling only; it does not protect a user who opens the emulator origin directly, which is intended (the emulator holds no secrets).

## Save export and import with bytes (prototype, 2026-10-22)

Test: profile A plays GAEM (New Game, Back to Title) and the bridge-side script **reads** `/GAEM/rms/SAVE0` (12 bytes) from CheerpJ's IndexedDB `cjFS_/files/`. A fresh profile B installs GAEM, then the script **writes** the records from outside (new `dir` record `/GAEM/rms`, parent `/GAEM` listing updated, new `file` record with a fresh `inodeId`, `permType` 33206). Result: the game started in B, Load Game opened a game screen (ice cave with the player), and the `SAVE0` bytes were unchanged after the game ran. Record format: `{type, contents, inodeId, permType, uid, gid, lastModified}`; file `contents` is a `Uint8Array`, dir `contents` lists child names with a leading slash.

What this proves: export by reading is easy, and import can work. What it does not prove: that the loaded state equals the saved state (the save was a fresh New Game, so a mid-game save was not tested), that this survives a CheerpJ update that changes the record format, or that a wrong `inodeId` or missing parent listing cannot corrupt `/files`. Verdict: **do not ship import by writing CheerpJ's storage from outside**. Build `export-saves` and `import-saves` Java-side in the fork (it already has `LauncherUtil.exportData` and `importData` for the whole `/files`), per game, and keep this test as a fallback idea only. Reading for `list-saves` stays acceptable.

## Limits of this prototype

One game, desktop headless browsers, localhost origins on one machine (same site, different origin; a separate registrable domain was not tested), no mobile, no concurrent hosts. The test was written by the same agent that wrote the bridge; an independent review of the allowlist logic is advisable before the real implementation.

## Next

- Add `export-saves` and `import-saves` with bytes (per game, not the whole `/files`) in the fork, Java-side (outside writing was shown to work once, but is fragile; see above). Test with a mid-game save.
- Decide the key-repeat behaviour and whether `key` should go through the emulator's repeat helper.
- Move the schema and contract tests into `pixelito-protocol` (task 16).
