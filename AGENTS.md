# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Agent skills

### Issue tracker

Issues are tracked in this repo's GitHub Issues, through the `gh` CLI.
See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels, each named after its role: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`.
See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` and `docs/adr/` at the repo root.
See `docs/agents/domain.md`.

## Overview

This repository manages source control infrastructure for "unmango" using Pulumi (TypeScript). It defines repositories, branch protection rulesets, and forge settings as code.
One Pulumi program covers every forge; each forge has its own directory (`github/`) imported from the root `index.ts`.

## Commands

```bash
make install     # Install dependencies and select prod stack
make lint        # Run ESLint (yarn lint)
make fmt         # Format code with dprint and nixfmt
make preview     # Preview Pulumi changes (dry run)
make diff        # Show detailed diff of changes
make up          # Deploy changes to prod stack
make refresh     # Refresh stack state from GitHub
```

Formatting uses **dprint** (not prettier) — run `make fmt` before committing.

## Architecture

### Component Hierarchy

```
Repo (abstract base)
├── PublicRepo   — public repos with branch rulesets and optional Pages
└── PrivateRepo  — private repos, no rulesets
```

**`github/components/repo.ts`** — Base class: sets defaults (squash-only merging, no auto-merge, delete branch on merge, MIT license).

**`github/components/publicRepo.ts`** — Adds a `main` branch ruleset enforcing: required PRs, stale review dismissal, required status checks (mapped to GitHub integration ID `15368`), required signatures, linear history, no fast-forward.

**`github/components/privateRepo.ts`** — Minimal: just the base Repo with private visibility.

**`index.ts`** — Entrypoint; re-exports each forge's program, such as `./github`.

**`github/repos.ts`** — Instantiates all managed repos as `PublicRepo` or `PrivateRepo` with their specific status check names, one exported const each.

**`github/community.ts`** — Commits the org's default community health files (`github/community/*`: the AI contribution policy, contributing guide, and PR template) to `unmango/.github`. Edit the policy there; the glossary for it is `CONTEXT.md`.

**`github/labels.ts`** — Labels every repo gets by default: AI disclosure (`ai-assisted`), triage, and wayfinder.

**`github/index.ts`** — Organization-level resources (Actions secrets) and the `repos` stack output, derived from every export of `repos.ts`.

### Authentication

Uses GitHub App credentials stored in Pulumi config (`Pulumi.prod.yaml`): app ID `1264044`, installation ID `66536645`.

### Stack

Single stack: `UnstoppableMango/unmango-scm/prod`
