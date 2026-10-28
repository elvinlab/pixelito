# Visual direction

- **Status:** Provisional, first pass (task 13), 2026-10-22
- **Owner feedback so far:** "modern, retro, melancholic" (about the palette and mood); likes the one-body console on desktop and the thumb field on phones.
- **What exists:** mocks only, in a private Claude Design canvas (phone: home, loading, first-run guide, play, choose controls, toasts, notifications, profile, sign in, check your email; desktop: home, play; one tokens board). Game screens in the mocks are placeholders, not real captures. Export the canvas before Phase 1 so the repo holds the source of truth.

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
| Violet | `#a78bfa` | 6.9:1 | Links, active tab |
| Button | `#7c3aed` | white on it 5.7:1 | The only filled action color (Resume, Play, OK) |
| Cyan | `#22d3ee` | 10.4:1 | What is happening now: selected, unread, loading progress |
| Pink | `#ec4899` | 5.3:1 | Favorites (hearts) only |
| Playable | `#34d399` | 9.7:1 | Compatibility status; also saved and "yours" |
| Partial | `#fbbf24` | 11.2:1 | Compatibility status and trophies (new; the brand has no warning color) |
| Does not run | `#fb7185` | 7.0:1 | Compatibility status, destructive actions |

Status is always color plus a word. "Untested" is muted gray with a label.

### Color roles

Violet alone made every screen look single-color, so each color has one job:

| Color | Job |
|---|---|
| Violet | Acts: buttons, links, active tab |
| Cyan | Now: continue hero, selected control scheme, unread dot, loading progress, thumb field |
| Amber | Trophies and achievements |
| Green | Saved, and files the user added ("Add your .jar", "My game") |
| Pink | Favorites |

Each game also carries its own accent, shown as a stripe on its card, its sprite and its time bar in the profile (mocks: GAEM cyan, PacMan amber). With more than a few games, accents must be assigned from the palette without repeating "now" cyan; decide that when the catalog exists.

## Type

- Press Start 2P: logo and short uppercase labels, 11 px minimum, never sentences.
- Pixelify Sans: game and section titles.
- IBM Plex Sans (400, 600): everything that is read. Sizes 32, 22, 18, 15, 13; 12 is the floor.
- JetBrains Mono: keyboard hints such as F1, F2, Enter.

All four are in the elvinlab.dev brand and licensed under the SIL Open Font License (confirm before shipping). In the product, the fonts are self-hosted (done 2026-10-28, Fontsource 5.3.0, Latin subset in woff2, weights 400 and 600 of Plex, 400 of the other three, 88 KB in total and fetched only when a face is used) instead of loading Google Fonts: no third-party request per visit (privacy), one connection less (speed). Measured in a browser: five faces loaded, zero external requests.

## Shape and motion

- Square corners, 2 px borders, a 5 px darker bottom edge on keys that sinks to 2 px when pressed. Icons drawn on a pixel grid, never emoji. Tap targets 44 px or larger.
- Spacing scale: 4, 8, 12, 16, 24, 32.
- Sprites bob and blink in two steps. Screens move 150 to 250 ms with ease-out. Key press is instant. Everything stops under `prefers-reduced-motion`.
- Background: the brand's dot grid and soft violet and cyan glow, only behind the console body.

## Layout decisions

- **Phone first.** Default control scheme is the thumb field: a floating pixel ring on the left half, an arc of OK and number keys on the right, soft keys inside the screen corners, a 0-9 tray on demand. Three alternatives (classic pad, phone keypad, controller) are one tap away, even mid-game. A first-run guide shows numbered leader lines on the controls.
- **Desktop is a console, not a dashboard.** One body: game screen at about 1.9x on the left; soft keys, D-pad with L and R, and the 0-9 keypad on the right, each with its keyboard equivalent. "Hide pads" for keyboard players. Home is a resume hero (the console showing the last game) beside a card grid.
- **Home** shows one obvious action (Resume), library tabs (All, Favorites, History), Play and Manage per game, and a large "Add your .jar" drop zone saying the file never leaves the browser.

## Flows

Designed as mocks (phone unless noted):

1. **Loading:** real stages (emulator, game files, controls), progress bar, current control scheme with a change button, one rotating tip with pager dots.
2. **Toasts:** achievement toast with "View", "Progress saved" toast, problem toast with "Retry". Achievements wait for a safe moment in the game. Every toast is kept in Notifications. Errors stay until dismissed; the rest leave after about 5 s.
3. **Notifications:** Today and Earlier, unread markers, "Mark all as read", and a card inviting sign-in ("Not now" always available). In-app only and stored on the device; system push is out of MVP scope (needs permission, not required).
4. **Profile:** pixel avatar, guest or signed-in chip, hours played, games, trophies, time per game, controls, export saves, delete my data. Hours are counted on the device from day one, with no account, and sync when there is an account.
5. **Sign in:** "Keep your progress", Continue with Google, email field, "Send magic link", and "Not now, keep playing". Then a "Check your email" screen with a resend countdown and "Use a different email". The account is optional (ADR 0001) and offered after the first game, never before. Method decided by the owner on 2026-10-22: magic link by email plus Google sign-in, no passwords, so there is no password field and no password recovery screen. The vendor choice (task 11) must support both methods. The Google button in the mock is neutral; the real one must follow Google's brand guidelines.

Not designed yet:

6. Skeleton and empty states, only where data really takes time (synced profile, trophies, catalog). The local library loads near-instantly and needs none.
7. 0-9 tray open, landscape play, editing the display name, and animated transition specs.

## Left out on purpose

Java logo (Oracle trademark), covers of commercial games, rankings, XP, community feeds, clock and music widgets. User-loaded commercial `.jar` titles appear only in that user's browser, never in the official catalog.

## Open

- Owner review of `PRODUCT.md` positioning (inferred, unconfirmed).
- Real prototype and a phone to judge feel, performance and the thumb field (task 14).
- The accessibility floor of 11 px for Press Start 2P labels should be checked on a real phone.
