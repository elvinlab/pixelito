# ADR 0001 — Scope, stack and ground rules

- **Status:** Provisional
- **Date:** 2026-10-22
- **Deciders:** project owner
- **Supersedes:** the earlier working plan "elvinlab arcade" (draft)
- **Related:** ADR 0002 — Repository structure, workflow and guardrails

Nothing here is legal advice. Items marked *unverified* were not confirmed against a primary source and must be checked before they are relied on.

## Context

Pixelito is a personal project meant to attract an audience first and earn money later. A competitive scan found that existing J2ME-in-browser products offer little beyond running a file: Handyplay is invite-only beta and rates almost all titles "Partial", Back to Java keeps no saves, and none combines free persistent saves, achievements and a community. User feedback for these products was not found, so market claims are a map, not data.

## Decisions

Each row can be reopened when its trigger fires.

### Product

| Decision | Reason | Reopen when |
|---|---|---|
| Name **Pixelito**, target domain `pixelito.app` (owner decision 2026-10-22: **keep Pixelito** after comparing alternatives such as Pixifon, Pixefon and Polifon; "J2ME" and "Java" stay out of the name for trademark caution; domain and trademark checks on `Pixelito` are still pending, see `docs/notes/name-check.md`) | Reads the same in English and Spanish; independent of the owner's personal brand | Domain is taken, a trademark conflict appears, or task 10 finds a better candidate |
| Own visual identity, discreet "by elvinlab" credit | Project can grow without carrying the personal brand | — |
| Dark console UI with light 8-bit/pixel-art details | Memorable, readable, not themed everywhere | Design spike shows poor legibility |
| Free to play and free to start | The priority is gaining an audience | — |
| **Performance is a headline feature**, not a polish pass: the app shell must feel instant, and the cost of starting a game must be hidden or shrunk as far as measurement allows. Budgets are set from Phase 0 numbers and enforced as CI gates | The owner cares most about speed; fast is also how a free product wins against slow alternatives | Measurements show a budget cannot be met with this engine (then trade features, never hide the number) |

### Catalog and legal

| Decision | Reason | Reopen when |
|---|---|---|
| Only legally clean content: freely licensed demo games plus user-supplied `.jar` files that run **only in the user's browser** and are never uploaded | "Abandonware" has no legal standing; hosting third-party files is risky | A rights holder grants permission to host titles |
| No third-party game files are hosted | Same | — |
| No games made by the owner | Owner choice | — |

### Engine

| Decision | Reason | Reopen when |
|---|---|---|
| Use `freej2me-web` (CheerpJ) | The only working browser J2ME option found; writing an engine is out of scope | CheerpJ licensing blocks the model, or a better engine appears |
| Emulator runs in an iframe on a separate origin (sandbox `allow-scripts allow-same-origin`, no cookies, no tokens), talking to the app through a versioned `postMessage` protocol | Isolates untrusted `.jar` files; keeps the engine replaceable. Measured: CheerpJ fails with `allow-scripts` alone | CheerpJ requires a different embedding model |
| Contact Leaning Technologies before launch about a free hosted service with an optional paid tier | The licence page does not state SaaS terms | — |

### MVP scope

In: playing a `.jar` (keyboard, touch, gamepad), freely licensed demos, local saves with guest mode, library with compatibility status, platform achievements, profile, optional account.
Out for now: rankings, reviews, blog, cloud saves, billing.

### Achievements and rankings

- Launch with **platform achievements** (hours, titles played, streaks, collection) showing rarity as a percentage.
- Separate pilot: one in-game achievement in a single open-source game, as research.
- Rankings are platform-based and come after the MVP.

### Stack (provisional, to be validated in Phase 0)

- Next.js + TypeScript + Tailwind, Supabase (free), Vercel Hobby, Resend for email, i18n from day one (one language at launch).
- Open question: Next.js vs a Vite SPA for an app-like, installable feel. Decide with a spike, not by preference.
- Free-tier limits that matter: Supabase Free pauses after one week of inactivity; Vercel Hobby forbids commercial use (donations are explicitly allowed, a paid tier or ads are not).
- It stops being free when the paid tier or ads launch (Vercel Pro) or when Supabase must stay awake.

### Accounts, abuse and data

- Sign-in: Google, Discord, GitHub or an emailed magic link. No passwords.
- Guest mode with Supabase anonymous sign-in, protected with Cloudflare Turnstile; scheduled cleanup of abandoned guests.
- Minimum age 16.
- Avatar from a preset pixel-art catalogue and a validated username; no free text in the MVP.
- Minimal data: account identity, avatar, username, progress. Cookie-less usage statistics, no third-party trackers, account export and deletion. The tool for statistics is *unverified*.

### Licensing and publication

- **Three repositories** (see ADR 0002). The emulator fork is **public** under GPLv3 (required because it derives from FreeJ2ME). The postMessage specification and schemas shared by both sides are a small **public MIT** repository. The platform (UI, API, achievements) is **private**, all rights reserved. More can be opened later by choice.
- Whether the platform is a separate work from the GPL fork (iframe on a separate origin, message passing) is an *unverified* legal question. Confirm with a lawyer.
- **Public beta from the start**, labelled "Beta", no invitation gate.
- Terms and privacy: plain-language drafts published with the beta, **lawyer review before accepting donations or launching a paid tier**. Drafts must cover: minimum age 16, user `.jar` files never leave the browser, and a contact for copyright complaints.

### Devices

Desktop (Chrome, Firefox, Edge) and Android Chrome first. iOS Safari is best effort until measured.

### Money

Free at launch; voluntary donations. First paid product, later: cloud saves. Price not set. Payments from Costa Rica via a merchant of record (Polar lists Costa Rica for payouts; Lemon Squeezy lists it for bank payouts; Stripe direct is unlikely to be available). Billing is deferred.

## Gates

- If mobile performance fails, launch desktop-first. Numeric thresholds are set from Phase 0 benchmarks.
- If an in-game achievement cannot be verified, the platform continues with platform achievements.

## Consequences

- The platform depends on a proprietary runtime (CheerpJ), which needs an internet connection and may change terms.
- The only unavoidable initial cost is the domain.
- Several legal and licensing statements are unverified and are listed as Phase 0 tasks.

## Unverified items

1. How `freej2me-web` stores RMS data and which events it exposes.
2. Which CheerpJ version `freej2me-web` uses (the build is the dated CDN path `20260317_2978`; the major number is unknown) and whether our use fits its licence. Read 2026-10-22: free for personal/FOSS use and for commercial use by individuals and one-person companies; public site, donations and CDN loading are not addressed; see `docs/notes/cheerpj-licensing.md`.
3. ~~Whether CheerpJ requires cross-origin isolation (COOP/COEP).~~ Answered 2026-10-22 in Chromium and Firefox: it does not, and `COEP: require-corp` breaks it. Also found: the iframe needs `allow-same-origin` (on its own separate origin); see `docs/notes/freej2me-web.md`. Mobile browsers not yet tested.
4. Whether Supabase Free terms permit a commercial project. Read 2026-10-22 (summarised): the Terms do not mention a Free plan or restrict commercial use, and do not grant it either; unconfirmed, see `docs/notes/supabase-terms.md`.
5. Whether keep-alive pings for Supabase are acceptable. Not addressed in the Terms or the billing doc; do not rely on them (see the same note).
6. Exact licences of candidate demo games.
7. Costa Rica data-protection duties (Ley 8968), including any database registration.
8. Whether Cloudflare Workers Free limits (reported 10 ms CPU, 100k requests per day) fit any part of the app.
9. Whether the private app can be treated as a separate work from the GPL emulator fork when they only exchange messages across origins.
10. Whether the MIT protocol repository is enough to keep the private app free of GPL code.
