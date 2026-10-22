# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary (confirmed by the owner, 2026-10-22): adults who played J2ME games on feature phones as kids and now open Pixelito on their phone in spare moments (commute, a break). They want to open it and play, with nothing to install and nothing to configure. Other audiences (curious younger players, collectors with their own `.jar` files) are secondary and not yet confirmed.

## Product Purpose

Pixelito is a free, installable web app that plays J2ME `.jar` games in the browser, keeps saves between sessions and awards platform achievements. Success: a returning player opens the app and is playing within seconds, and a first-time player is never lost.

## Positioning

Confirmed by the owner, 2026-10-22: the two things that matter most are the console feel and playing fast. Pixelito is the easiest way to replay the J2ME games you grew up with: open it, be playing within seconds, in an app that feels like a handheld console. Free persistent saves, achievements and honest compatibility labels support that promise; they do not lead it. No claim about other products until it is checked against evidence.

## Operating Context

- Phone first (Android Chrome), then desktop. Playing happens on a touch screen with the thumbs; games expect a 240×320 screen, soft keys and number keys.
- The emulator runs in an iframe on a separate origin and talks to the app through a versioned postMessage protocol.
- Starting a game is slow compared with the app shell (measured 1 to 5 seconds on desktop, phone unmeasured); the shell must feel instant.

## Capabilities and Constraints

- Only legally clean content: freely licensed demo games and user-supplied `.jar` files that never leave the browser.
- Compatibility labels: Playable, Partial, Does not run, Untested (only a human grants Playable).
- MVP: play, local saves with guest mode, library, platform achievements, profile (with hours played, counted on the device), optional account. The account is offered after the first game, never as a wall before playing. Notifications are in-app (achievement toasts and a notification center); system push is out of scope.
- Speed is a headline feature; budgets are enforced as CI gates.
- Open decisions: control scheme, stack (Vite or Next.js), backend vendor.

## Brand Commitments

Name: Pixelito (owner decision, 2026-10-22). Discreet "by elvinlab" credit. Dark console UI with light 8-bit/pixel-art details (ADR 0001). Mood, from the owner: modern, retro, melancholic. Visual family: the `elvinlab.dev` tokens (violet, cyan and pink on a near-black violet base; IBM Plex Sans, Press Start 2P, Pixelify Sans, JetBrains Mono); details in [docs/notes/visual-direction.md](docs/notes/visual-direction.md). Docs and UI copy in English.

## Evidence on Hand

Two demo candidates tested: GAEM (GPLv2 or later, plays) and PacMan (untested). No user research, no analytics, no testimonials. Do not invent statistics, player counts or ratings.

## Product Principles

1. Plug and play: one obvious action on every screen; nobody gets lost.
2. Honest about quality: compatibility and load times are shown as measured.
3. Fast shell: the cost of starting a game is hidden or shrunk, never disguised.
4. Console feel on a phone first; desktop adapts, it does not lead.
5. The user's files and saves stay theirs, in their browser.

## Accessibility & Inclusion

Contrast AA minimum, touch targets of at least 44 px, reduced-motion support, controls usable without precise gestures.
