# Notes — Backend options without the "frozen project" problem (Phase 0, follow-up to task 11)

- **Date:** 2026-10-22
- **Trigger:** the owner dislikes that a Supabase Free project can pause, which could ruin a first visit for a new user. Turso and others were raised as alternatives.
- **Sources:** the pricing pages of Turso, Cloudflare D1, Firebase and Neon, read through a fetch tool that **summarises** pages (read them yourself before deciding). Terms of use were **not** read for any of them. Not legal advice.

## What each plan says (Free tier)

| Option | Free limits from the page | Pauses when idle? | Built-in user accounts? | Commercial use on Free |
|---|---|---|---|---|
| Supabase (earlier note) | 2 projects, 500 MB DB per project, 50,000 MAU | Reported to pause after inactivity; the period is not in the docs read | Yes | Not stated |
| Turso | 100 databases, 5 GB, 500 M rows read and 10 M rows written per month | Not stated ("idle databases cost only storage") | **Not stated; it is a database, not an auth service** | Not stated |
| Cloudflare D1 | 5 GB, 5 M rows read per day, 100,000 rows written per day; when a daily limit is hit, queries stop until 00:00 UTC | Not stated; compute is billed only while querying | No (needs an auth library or service) | Not stated |
| Firebase Spark | Auth: no-cost up to 50K MAU (via Identity Platform); Firestore: 1 GiB, 50K reads, 20K writes, 20K deletes per day | Not stated | Yes; anonymous sign-in and the list of providers are not on the pricing page | Not stated |
| Neon | 100 projects, 1 GB per project, 100 CU-hours; Auth up to 60k MAU | **Yes, suspends after 5 minutes idle, cannot be turned off**; cold start time not stated | Yes (Neon Auth, 60k MAU) | Not stated |

"Not stated" means the page does not say, not that it is allowed or forbidden.

## Reading

1. **Two different problems get called "freezing".** A project that pauses for days (Supabase Free as reported) can make a first visit fail or wait a long time. A database that suspends after minutes and wakes on the next query (Neon) adds a delay on the first request but does not break it. The cold-start length for Neon was not on the page and must be measured before judging.
2. **Turso solves the database, not accounts.** Sign-in with Google, Discord, GitHub or a magic link, plus anonymous guests, would need an auth library or service next to it. Writing auth ourselves goes against the "boring, deterministic" principle in ADR 0002, so a managed or well-audited library is needed.
3. **Cloudflare D1** has no idle pause stated and sits next to Turnstile (already planned for guests), but it also needs an auth layer, and its daily write cap (100,000 rows) is the first limit a busy day could hit. Workers Free CPU limits remain unverified in ADR 0001.
4. **Firebase Spark** has accounts built in and no pause stated, at the cost of Google lock-in and a non-relational data model. Commercial terms were not on the pricing page.
5. **No option has its commercial-use terms confirmed.** Every candidate needs its Terms read, as Supabase's were.

## The design answer that does not depend on the vendor

The MVP is local-first (ADR 0001): playing, local saves, and the library need no backend. If the backend is slow or asleep, only sign-in, profile and achievement sync are affected, and those can show "connecting..." while the game keeps working. Keep the backend behind the hexagonal port from ADR 0002 so it can be swapped. This makes the pause a minor annoyance instead of a blocker, whichever vendor is picked.

## Recommendation (provisional)

- **Do not decide the vendor in Phase 0.** The exit gate needs playing, local saves and the bridge, not accounts. Decide after Phase 0 with a short spike.
- **Shortlist for the spike:** Firebase Spark (accounts included, no pause stated), Neon (Postgres and accounts included, but wakes from suspend, so measure the wake time), and Cloudflare D1 with a vetted auth library (no pause, more work). Turso only if paired with an auth library; it adds a second moving part over D1 for no clear gain here.
- **Supabase stays a candidate** if the pause turns out to be tolerable (for example once real traffic keeps it awake) or if the Pro plan is accepted at launch.

## To confirm before choosing

1. Read the Terms of each shortlisted vendor for commercial use of the free plan.
2. Measure the real wake-up time of a suspended Neon database and a paused Supabase project, if it can be done with a throwaway project.
3. Check anonymous sign-in and the OAuth providers (Google, Discord, GitHub, magic link) for Firebase and Neon Auth.
