# Pixelito

A free, installable retro-console web app for playing J2ME (Java ME) games in the browser, with persistent saves, platform achievements and, later, a community.

> **Status: planning. Everything in this repository is provisional.** Nothing here is a finished feature or a final decision. Each decision records its reason and the condition that reopens it.

Working slogan (draft, not final): *The games we grew up with. The achievements we never had.*

**Resuming work?** The current `Next step:` is at the top of [docs/phase-0-plan.md](docs/phase-0-plan.md). Branches: `main` (production) and `develop` (work).

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
