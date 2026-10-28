# Notes — Saves export and import (design proposal)

- **Status (2026-10-28):** export is implemented and checked end to end (protocol messages, a local fork change, a button on the play screen, a JSON backup file). Import is not: it needs a safe write path first (see below).
- **Decisions taken while the owner was away:** the host passes the save directory name in `export-save.app` (the emulator cannot know it), taken from the optional `Game.saveDir` of the catalogue; the backup file is JSON with base64 bytes; a new error code `save-failed` covers unreadable or over-limit saves. Revisit any of them on request.
- **Goal:** the player can back up a game's saves to a file and restore them, in the same browser or another one.

## What exists today (observed)

- CheerpJ keeps J2ME record stores in the emulator origin's IndexedDB `cjFS_/files`, store `files`, for example `/Rally Master Pro/rms/FL_RMP_OPT`. Saves already persist per browser, but only the emulator origin can read them.
- The protocol (version 1) already has `list-saves` (host) and `saves` (emulator, paths only), with validators for ids and list sizes.
- The directory name is the game's app name from the jar, not Pixelito's game id. Mapping is open question 1.

## Storage format (observed 2026-10-28, headless Chromium, Rally Master Pro)

- IndexedDB database `cjFS_/files/`, one object store `files`, out-of-line keys (the full path), no autoincrement.
- A file entry is `{ type, contents: Uint8Array, inodeId, permType: 33206, uid, gid, lastModified }`; a directory entry has `contents: Array` (child names) and `permType: 16895`. Example: `/Rally Master Pro/rms/FL_RMP_OPT` holds 1478 bytes.
- **Export** can read these entries directly (read-only), so it is low risk.
- **Import by writing IndexedDB directly is not safe to ship unverified.** The entries carry inode ids and the parent directory lists its children, and CheerpJ may keep its own in-memory copy after mounting. A raw write can leave a directory and its files inconsistent, or be ignored or overwritten by the running runtime. Import needs a write path through CheerpJ or the Java side (for example the launcher's own `importData`), which has to be tested against a real run first.
- Suggested order: ship export first (host-side backup works, restore is manual), then add import once a consistent write path is proven.

## Proposed messages (additive, still protocol version 1)

| Direction | Message | Fields |
|---|---|---|
| host to emulator | `export-save` | `id` |
| emulator to host | `save-data` | `id`, `files: { path, data }[]` (`data` is an `ArrayBuffer`, sent as transferable) |
| host to emulator | `import-save` | `id`, `files: { path, data }[]` |
| emulator to host | `import-result` | `id`, `imported: number` |

- New `ready.capabilities` entries, `saves-export` and `saves-import`, let the host hide the buttons on an emulator that lacks them. An old emulator answers an unknown type with the existing `error` / `unknown-type`.
- Adding messages is not a break of the contract: existing messages and their fields do not change.

## Security rules (the sensitive part)

- Every path is validated on both sides: it must start with `/<appName>/rms/`, contain no `..`, no empty segments and no backslashes. Nothing outside `rms` is ever read or written, so `app.jar`, `config` and the library stay untouched.
- Hard limits, enforced before any write: files per message, bytes per file and total bytes. A message over a limit is refused whole, never truncated.
- Import is only accepted before the game starts (before `started`), because a running game holds record stores open and may overwrite or ignore the new bytes.
- Import replaces the game's `rms` directory atomically as far as IndexedDB allows (one transaction), so a failure leaves the old saves.
- Origin checks stay as they are: the bridge answers only the allowlisted origins.
- Data is opaque bytes. Pixelito never parses a save, and the file format is a zip or a JSON list of `{ path, base64 }` chosen in the host.

## Work needed

1. `pixelito-protocol`: four types, validators, contract tests (valid, over limit, bad path, unknown field), then bump the pinned commit in `pixelito`.
2. Fork (`web/src/pixelito-bridge.js`): read and write IndexedDB `cjFS_/files` for the validated paths, advertise the two capabilities.
3. `pixelito`: a `SaveStore` port with an emulator-backed adapter, two buttons (export, import) on the play screen and a file picker, es/en strings.

## Open questions

1. *(decided)* The catalogue entry stores the directory name as `saveDir`; the official GAEM entry has none yet, so no button shows for it.
2. *(decided)* JSON.
3. Should export also run automatically on a timer as a cloud-sync step later? Out of scope here.

## Checked on 2026-10-28

- Protocol contract tests (23). Host: `saveBackup` tests and the app suite (48).
- Fork, headless Chromium, host page on the allowed origin: `export-save` for `Rally Master Pro` returns `FL_RMP_OPT` (1478 bytes); an unknown app returns an empty list; `app: '../x'` is dropped without an answer.
- Pixelito app: the button appears once the emulator advertises `saves-export` and the game has a `saveDir`; clicking it downloads `rally-saves.json`.
- The fork change (`web/src/pixelito-bridge.js`, regenerated `web/src/protocol.js`) is local and uncommitted, like the rest of the fork. Deploy the emulator before relying on the button; an older emulator does not advertise the capability, so the button stays hidden.
- Not covered: Firefox and Safari, a game with many stores near the limits, saves that CheerpJ has not flushed to IndexedDB yet.
