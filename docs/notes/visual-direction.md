# Visual direction

- **Status:** Provisional, first pass (task 13), 2026-10-22
- **Owner feedback so far:** "modern, retro, melancholic" (about the palette and mood); likes the one-body console on desktop and the thumb field on phones.
- **What exists:** mocks only, in a private Claude Design canvas (phone: home, loading, first-run guide, play, choose controls; desktop: home, play; one tokens board). Game screens in the mocks are placeholders, not real captures. Export the canvas before Phase 1 so the repo holds the source of truth.

## Brand

Pixelito is a sibling of `elvinlab.dev`: it reuses that site's design tokens (`packages/core/src/tokens/tokens.json` in that repo) so both read as one family. Dark first. The brand's light theme exists and is postponed until after launch.

## Color

All contrast ratios were computed (WCAG), not eyeballed.

| Role | Value | Contrast | Use |
|---|---|---|---|
| Page | `#07070f` | | Background |
| Banner | `#0a0816` | | Bars |
| Card | `#121022` | | Cards, console body |
| Card hover | `#1d1934` | | Keys, tiles |
| Control edge | `#6d63a8` | 3.6:1 on card | Borders of controls (new; the brand divider is too faint to delimit buttons) |
| Line | `#3b3560` | 1.7:1 | Decoration only |
| Text | `#eceff4` | 16.2:1 | |
| Secondary | `#c3c9d4` | 11.2:1 | |
| Muted | `#8b949e` | 6.1:1 | |
| Violet | `#a78bfa` | 6.9:1 | Links, active tab, rings |
| Button | `#7c3aed` | white on it 5.7:1 | The only filled action color (Resume, Play, OK) |
| Cyan | `#22d3ee` | 10.4:1 | Selected or now playing |
| Pink | `#ec4899` | 5.3:1 | Hearts and trophies only |
| Playable | `#34d399` | 9.7:1 | Compatibility status |
| Partial | `#fbbf24` | 11.2:1 | Compatibility status (new; the brand has no warning color) |
| Does not run | `#fb7185` | 7.0:1 | Compatibility status |

Status is always color plus a word. "Untested" is muted gray with a label.

## Type

- Press Start 2P: logo and short uppercase labels, 11 px minimum, never sentences.
- Pixelify Sans: game and section titles.
- IBM Plex Sans (400, 600): everything that is read. Sizes 32, 22, 18, 15, 13; 12 is the floor.
- JetBrains Mono: keyboard hints such as F1, F2, Enter.

All four are in the elvinlab.dev brand and licensed under the SIL Open Font License (confirm before shipping). In the product, self-host a Latin subset in woff2 instead of loading Google Fonts: no third-party request per visit (privacy), one connection less (speed).

## Shape and motion

- Square corners, 2 px borders, a 5 px darker bottom edge on keys that sinks to 2 px when pressed. Icons drawn on a pixel grid, never emoji. Tap targets 44 px or larger.
- Spacing scale: 4, 8, 12, 16, 24, 32.
- Sprites bob and blink in two steps. Screens move 150 to 250 ms with ease-out. Key press is instant. Everything stops under `prefers-reduced-motion`.
- Background: the brand's dot grid and soft violet and cyan glow, only behind the console body.

## Layout decisions

- **Phone first.** Default control scheme is the thumb field: a floating pixel ring on the left half, an arc of OK and number keys on the right, soft keys inside the screen corners, a 0-9 tray on demand. Three alternatives (classic pad, phone keypad, controller) are one tap away, even mid-game. A first-run guide shows numbered leader lines on the controls.
- **Desktop is a console, not a dashboard.** One body: game screen at about 1.9x on the left; soft keys, D-pad with L and R, and the 0-9 keypad on the right, each with its keyboard equivalent. "Hide pads" for keyboard players. Home is a resume hero (the console showing the last game) beside a card grid.
- **Home** shows one obvious action (Resume), library tabs (All, Favorites, History), Play and Manage per game, and a large "Add your .jar" drop zone saying the file never leaves the browser.

## Flows planned (not designed yet unless noted)

1. Loading (designed): real stages (emulator, game files, controls), progress bar, current control scheme with a change button, one rotating tip.
2. Achievement toast and a notification center (so a missed toast is not lost). In-app only; system push is out of MVP scope (needs permission, not required).
3. Profile with hours played. Hours can be counted on the device from day one, with no account; they sync when there is an account.
4. Register and login. The account is optional (ADR 0001) and offered after the first game, never before. Method decided by the owner on 2026-10-22: magic link by email plus Google sign-in, no passwords. That means no password fields and no password recovery screen; the vendor choice (task 11) must support both methods.
5. Skeleton and empty states, only where data really takes time (synced profile, trophies, catalog). The local library loads near-instantly and needs none.
6. Still missing from the phone flow: 0-9 tray open, landscape play.

## Left out on purpose

Java logo (Oracle trademark), covers of commercial games, rankings, XP, community feeds, clock and music widgets. User-loaded commercial `.jar` titles appear only in that user's browser, never in the official catalog.

## Open

- Owner review of `PRODUCT.md` positioning (inferred, unconfirmed).
- Real prototype and a phone to judge feel, performance and the thumb field (task 14).
- The accessibility floor of 11 px for Press Start 2P labels should be checked on a real phone.
