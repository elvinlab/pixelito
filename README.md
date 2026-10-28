# Pixelito

A free, installable retro-console web app for playing J2ME (Java ME) games in the browser, with persistent saves, platform achievements and, later, a community.

> **Status: Phase 0 spike with a working prototype. Everything in this repository is provisional.** The library, the play screen with Pixelito's own keys, Spanish and English strings, self-hosted fonts, an emulator warm-up and an installable offline shell exist; nothing here is a finished feature or a final decision. Each decision records its reason and the condition that reopens it.

Working slogan (draft, not final): *The games we grew up with. The achievements we never had.*

**Resuming work?** Read [docs/notes/session-handoff.md](docs/notes/session-handoff.md) first (state, how to run, open bugs, blockers), then the current `Next step:` at the top of [docs/phase-0-plan.md](docs/phase-0-plan.md). Branches: `main` (production) and `develop` (work).

## Documents

| Document | Purpose |
|---|---|
| [ADR 0001 — Scope, stack and ground rules](docs/adr/0001-scope-stack-and-ground-rules.md) | Provisional decisions, with revisit triggers |
| [ADR 0002 — Repository structure, workflow and guardrails](docs/adr/0002-repository-structure-workflow-and-guardrails.md) | Folders, architecture, dependency policy, verification speed budget |
| [Phase 0 plan](docs/phase-0-plan.md) | Spikes, experience criteria and the gate before building the product |

## Principles

1. Nothing is set in stone. Decisions are written down so they can be changed deliberately.
2. Experience first, and **speed is a headline feature**: an instant-feeling app shell, a game start that is measured and shrunk as far as possible, installable, with a light 8-bit touch on a modern dark console UI.
3. Free to play, free to start. The only planned initial cost is the domain.
4. Measure before promising: compatibility and performance claims need evidence.
5. Legal by design: no hosting of third-party game files.

## Development

Tools are pinned in `.mise.toml` (Node, pnpm); run `mise install` once.

| Command | What it does |
|---|---|
| `pnpm install` | Install dependencies. `pnpm-workspace.yaml` sets `minimumReleaseAge: 10080`, so versions younger than 7 days are refused |
| `pnpm dev` | Start the Vite dev server |
| `pnpm check` | Biome (lint + format check), TypeScript strict typecheck and the Vitest tests |
| `pnpm test` | Only the Vitest tests |
| `pnpm format` | Apply Biome fixes and formatting |
| `pnpm build` | Typecheck and build to `dist/` |
| `pnpm preview` | Serve the production build (the service worker registers only there) |

Code conventions: TypeScript strict (plus `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`), `@/` alias for cross-folder imports, TSDoc (`/** */`) on every exported symbol saying what it is for, not how it works. Architecture rules are in ADR 0002.

The play screen needs the emulator on a separate origin (default `http://127.0.0.1:5174`, override with `VITE_EMULATOR_ORIGIN`). For now `vite.config.ts` and `tsconfig.json` resolve `pixelito-protocol` from a sibling checkout at `../pixelito-protocol`.

Games for trying on one machine only go in `src/features/library/catalog.local.ts`, which is git-ignored (same shape as `catalog.ts`, exporting `LOCAL_GAMES`; a game may set `confirmKey: 'five'` when it only reacts to 5). Never commit commercial games.

The emulator is a separate project (a fork of `freej2me-web`) that is not published yet; how to run it locally, and what the fork needs, is in [docs/notes/freej2me-web.md](docs/notes/freej2me-web.md) and the handoff note.
