# ADR 0002 — Repository structure, workflow and guardrails

- **Status:** Provisional
- **Date:** 2026-10-22
- **Related:** ADR 0001 (scope, stack and ground rules)

Built from what worked in `elvinlab.dev` (screaming architecture, ADRs, `odd/tasks`, touch-scoped verification, enforced boundaries), adapted to an app instead of a content site, and checked against recent research on coding agents. Evidence is thin in places (mostly search summaries and a few preprints); claims that rest on one source are flagged.

## Principles

1. **Boring and current, not newest.** Adopt a dependency or a major version when it is mature and has aged, never because it is the latest. Security beats novelty.
2. **Fast feedback.** Verification has time budgets. Anything slow runs only when what it covers was touched.
3. **Deterministic gates over agent compliance.** Checks that do not depend on an agent obeying instructions carry the weight.
4. **Everything is revisable.** Each rule below is provisional and says what reopens it.

## 1. Repositories

| Repository | Visibility | Licence | Holds |
|---|---|---|---|
| `pixelito` | private | all rights reserved | the app monorepo |
| `pixelito-emulator` | public | GPLv3 (derived from FreeJ2ME) | fork of `freej2me-web` |
| `pixelito-protocol` | public | MIT | the postMessage specification and schemas shared by both sides |

Whether the private app stays a separate work from the GPL fork is a legal question for a lawyer (see ADR 0001).

## 2. Layout of `pixelito`

```
apps/web/                    installable PWA
  src/features/              library · play · achievements · profile · auth   (each exposes only index.ts)
  src/shared/ui/             atoms → molecules → organisms
  src/pages | app/           thin routes, no logic
apps/emulator-host/          page that hosts the emulator on its own origin
packages/domain/             pure TypeScript: rules, records, statuses
packages/adapters-idb/       IndexedDB save store
packages/adapters-supabase/  accounts, achievements, cloud saves
packages/tokens/             Pixelito tokens and themes
supabase/                    migrations, seeds, pgTAP tests
docs/adr/  docs/phase-0-plan.md  docs/TESTING.md
odd/tasks/  CLAUDE.md  AGENTS.md  .mise.toml  biome.json  .dependency-cruiser.cjs
```

The framework (Next.js or Vite SPA) is decided in Phase 0. The layout does not depend on it.

## 3. Architecture rules

- `domain` is pure TypeScript: no React, no Supabase, no browser APIs.
- Ports (`SaveStore`, `AchievementRepository`, `EmulatorPort`) live in `domain`; adapters implement them.
- A feature exposes only its `index.ts`. Pages compose features and hold no logic. `shared` never imports `features`.
- `@/` alias for cross-folder imports inside an app; `./` only inside the same folder.
- The emulator bridge uses the shared protocol: versioned, schema-validated on both sides, with `event.origin` and `event.source` checked.
- Enforced by `dependency-cruiser` (and Biome `noImportCycles` / `noPrivateImports`, to be confirmed). Rules fail CI.
- Born in the project, extracted when repeated. A shared package with `elvinlab.dev` is evaluated only when a real second consumer needs it (ADR 0019 of that repo names Pixelito as that consumer).

## 4. Components

Atomic design inside `shared/ui` (button, badge, trophy, avatar frame, game card). Semantic tokens only, never raw colours. Mobile first. Every animation stops under `prefers-reduced-motion`. A visual component catalogue (Ladle or Storybook) is decided in Phase 0.

## 5. Tooling

pnpm workspaces, tools pinned with `mise` (`packageManager` must match), TypeScript strict, Biome, Vitest, Playwright with axe. No task runner at the start; add Turborepo only if timings demand it. No Nx.

## 6. Dependency and security policy

- **Release age:** `minimumReleaseAge` set explicitly in `pnpm-workspace.yaml`. Provisional value: 7 days, shorter only for a security fix reviewed by hand. (The reported pnpm 11 default is *unverified*; do not rely on it.)
- Committed lockfile; CI installs with `--frozen-lockfile`.
- Install scripts only from an explicit allowlist.
- A new package is checked for existence, reputation and licence **before** it is installed. Models invent package names.
- Major upgrades go through a short note in the task log; no drive-by upgrades.
- Weekly grouped update PRs from a bot, never auto-merged.
- Secrets only in provider settings or git-ignored files. No credentials in delegated agent sessions.
- Every table has row-level security, and every policy has a pgTAP test.
- CSP and security headers on both origins; the emulator iframe is on a **different origin** from the app and sandboxed with `allow-scripts allow-same-origin` (measured: `allow-scripts` alone breaks CheerpJ, see `docs/notes/freej2me-web.md`), has no cookies, receives no tokens, sends no `COEP: require-corp` (it breaks CheerpJ), and never gets `allow-top-navigation` or `allow-popups-to-escape-sandbox`.
- `CLAUDE.md`, `AGENTS.md`, CI workflows, lint and boundary configs and applied migrations are **protected files**: a delegated agent never edits them without the owner's approval. Agent rule files are a documented injection vector (one preprint reports up to 84% malicious-command execution).

## 7. Working with agents (`gentle-ai`)

- ODD as in `elvinlab.dev`: authorize → explore → size → track → implement tests-first → verify what changed → close with a `Risk:` line.
- Overrides inherited from `elvinlab.dev`: `odd/tasks/<feature>.md` in git is the only source of truth (no Engram mirror); a push to `main` needs the owner's explicit yes; Conventional Commits with no AI attribution.
- `CLAUDE.md` stays short: commands, hard constraints and pointers to ADRs. One preprint (Python only, four models) found long context files tended to lower success and raise cost by over 20%.
- Acceptance tests (end-to-end and protocol contract tests) are written by the orchestrator and are not editable by delegated workers. A diff check flags weakened or deleted tests.
- Mutation testing (Stryker) on the domain package, added once the domain exists.
- Delegation is logged in the verification ledger: tier, first-pass result, rework.
- Delegation briefs use the issue template with a tier. If the brief costs more than the change, do it inline.

## 8. Verification speed budget

All times are **targets to be measured**, then recorded in `odd/verification-timings.md`. A check that exceeds its budget gets an ADR or a fix.

| Tier | When | Target | Runs |
|---|---|---|---|
| T0 | on save / commit | < 10 s | format and lint on changed files |
| T1 | after a change | < 60 s | typecheck and unit tests of affected packages, boundary check |
| T2 | before push | < 5 min | all unit and contract tests, a few e2e flows at one viewport |
| T3 | CI on `main` | < 10 min | all gates in parallel, each run once |
| Heavy | only when touched, or nightly | no fixed budget | full e2e matrix, Lighthouse, device benchmarks, mutation tests |

Rules: touch-scoped verification (`pnpm verify` from the first commit, with a verification map and a ledger); never re-run a check whose scope is unchanged since its last green entry; report a skipped check as "not re-run: untouched since `<sha>`"; cache the pnpm store and browsers; run gates in parallel; no gate runs twice in the same pipeline.

## 9. Delivery

- Two long-lived branches only: `main` (production) and `develop` (work). No other long-lived branches; short-lived feature branches are optional and merge into `develop`.
- A push to `main` deploys and needs the owner's explicit yes. `develop` only reaches `main` through a release the owner asks for.

### Task tracking by documents

- Tasks live in git as documents: `odd/tasks/<feature>.md`, plus `docs/phase-0-plan.md` for Phase 0. No external tracker.
- Every task document ends its header with a **`Next step:`** line: one concrete action, the first thing to do when work resumes. It is updated at the end of every work session and whenever a task closes.
- Closing a task means: mark it done with its evidence (commit or check result), then rewrite `Next step:` to point at the following task.
- `README.md` links to the document holding the current `Next step:`, so anyone (or any agent) resuming starts from one place.
- Vercel previews are free and may replace some local e2e later; reopen if previews prove useful.
- Migrations are forward-only SQL files, tested with a local reset in CI; applied migrations are never edited.
- Observability on free tiers: Web Vitals and error tracking, chosen in Phase 0.

## 10. Documentation

English only, no twin files. Short ADRs with a "revisit when" line. Reference tables generated from code where possible. Mermaid diagrams for the context and the emulator bridge. A link check is added later.

## 11. First ten gates, in order

1. `.mise.toml`, pnpm workspace, `minimumReleaseAge`, frozen lockfile.
2. Biome, strict TypeScript, CI running lint, typecheck and tests.
3. Vitest with a first domain test.
4. dependency-cruiser rules enforced.
5. `pixelito-protocol` schema with a version field and contract tests.
6. ADR with the framework spike result.
7. App shell, manifest, service worker, Playwright install and offline test.
8. axe in end-to-end tests.
9. Supabase migrations, RLS and pgTAP in CI.
10. Preview deploy, Web Vitals and bundle-size gate.

`pnpm verify` and the ledger (item 7 of `elvinlab.dev`'s own checklist: "add early") start with gate 2, not after gate 10.

## Revisit when

| Rule | Reopen when |
|---|---|
| No task runner | Full verification exceeds the T3 budget |
| 7-day release age | A needed security fix is blocked by it, or sources show another value |
| Three repositories | Counsel says the protocol split is unnecessary or insufficient |
| Short `CLAUDE.md` | Agents repeatedly miss a rule that only the file could provide |
| Stryker deferred | The domain package exists |
| Time budgets | Measurements show they are unrealistic or too loose |

## Unverified

1. Whether Biome's boundary rules can replace part of dependency-cruiser.
2. The pnpm 11 default release age.
3. Serwist versus `vite-plugin-pwa` support for the chosen framework.
4. Whether the time budgets are achievable with this stack.
5. The legal separation between the private app and the GPL fork.
