# Notes — CheerpJ licensing (Phase 0, task 3 groundwork)

- **Date:** 2026-10-22
- **Source:** `https://cheerpj.com/licensing/` (fetched once; the tool returns a paraphrase with quotes capped at 125 characters, so the wording below is a summary). A second URL (`/docs/licensing/`) returned 404. **Read the page yourself before relying on any line here.** Not legal advice.

## What the page says

| Topic | Finding |
|---|---|
| Free tier (Core Community) | "free to use for personal projects, Free and Open Source Software, and technical evaluations" |
| Commercial use on the free tier | Allowed for **individuals and one-person companies** |
| Paid tiers | Core Small Business: £100 per developer per month, teams up to 10. Core Enterprise: price not stated. Non-profit, academic and public sector: discounts on request |
| Licensing unit | Core is licensed **per application** (what counts as one application is not defined on the page) |
| Self-hosting | Allowed under any commercial licence and for technical evaluations. Hosting on several servers, including through a CDN, is allowed under one licence |
| Loading from Leaning Technologies' CDN | **Not stated** for any tier |
| Public website / SaaS | **Not stated** |
| Donations or paid features for end users | **Not stated** |
| Traffic or usage limits | **None stated** |
| Attribution | Not stated |
| Current and deprecated versions | Not stated |

## Correction to earlier notes

An earlier research pass reported "no self-hosting" on the Community licence. This page says self-hosting is allowed under commercial licences and for evaluations. It does not say self-hosting is allowed on the free Community tier. Treat self-hosting on the free tier as **unconfirmed**, not forbidden.

## What it means for Pixelito

- **Plausibly fine today:** Pixelito is a personal project of one individual, and the free tier explicitly allows commercial use by individuals and one-person companies. Nothing on the page forbids a free public site.
- **Where it stops being fine, as written:** if the project gains a second person working on it (a co-founder, a paid contractor writing code), the one-person clause no longer applies and the Small Business tier (£100 per developer per month) is the written alternative. Budget that as a known growth cost.
- **Genuine gaps, to ask about:** (1) does a public free website that loads the runtime from their CDN fit the Community tier, (2) do donations and a later paid feature (cloud saves) change the answer, (3) what is "an application" when one site runs many games, (4) which CheerpJ major version the build `20260317_2978` is, and whether it stays supported.
- **No usage cap is stated.** Absence of a cap is not a promise, so a written answer matters before any growth push.

## Decision

The email to Leaning Technologies is **still worth sending**, but narrowed to the four questions above and sent once the owner approves the draft. Until they answer, keep building, with the engine decision recorded as conditional in ADR 0001 (already so).

## Fallback if the answer is no

Evaluate open-source JVMs for the browser against real games (compatibility and speed). Candidates and limits are unverified; see the reasoning in the ADR 0001 revisit trigger. Not started.
