# AGENTS.md

This file provides guidance to AI agents when working with code in this repository.

## Knowledge graph

`graphify-out/` holds a [graphify](https://github.com/Graphify-Labs/graphify) knowledge graph of this repository: code structure parsed with tree-sitter, plus the concepts and decisions in its docs.
Read `graphify-out/GRAPH_REPORT.md` before exploring files. It lists the graph's communities, its most connected nodes, and links between them you might not expect.
Ask the graph before searching: `graphify query "<question>"`, `graphify path "<A>" "<B>"`, `graphify explain "<name>"`.
`graphify` is in the dev shell, from `unmango/pkgs`.

A pull request that changes code or docs rebuilds the graph and commits it in the same pull request.
`graphify update .` re-extracts code without an LLM.
After a doc change, run the graphify skill with `--update` in an agent session (`graphify install` adds the skill), so the docs are read again.
Commit `graphify-out/graph.json`, `graphify-out/GRAPH_REPORT.md`, and `graphify-out/.graphify_labels.json`, which keeps the community names across rebuilds; the rest of `graphify-out/` is ignored.
`unmango/architecture` merges this graph with the other source control repositories' graphs.

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
One Pulumi program covers every forge; each forge has its own directory (`github/`, `gitea/`) imported from the root `index.ts`.

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

**`github/components/publicRepo.ts`** — Adds a ruleset named `main`, targeting the default branch, enforcing: required PRs, stale review dismissal, required review thread resolution, required status checks (mapped to GitHub integration ID `15368`), linear history, no force pushes, no deletion. It does not require signed commits. A repository's `pages` become a `RepositoryPages` child resource, not the repository's deprecated `pages` input; `pagesOptions` adopts an existing site.

**`github/components/privateRepo.ts`** — Minimal: just the base Repo with private visibility.

**`index.ts`** — Entrypoint; re-exports each forge's program, such as `./github`.

**`github/repos.ts`** — Instantiates all managed repos as `PublicRepo` or `PrivateRepo` with their specific status check names, one exported const each.

**`github/community.ts`** — Commits the org's default community health files (`github/community/*`: the AI contribution policy, contributing guide, and PR template) to `unmango/.github`. Edit the policy there; the glossary for it is `CONTEXT.md`.

**`github/labels.ts`** — Labels every repo gets by default: AI disclosure (`ai-assisted`), triage, and wayfinder.

**`github/index.ts`** — Organization-level resources (Actions secrets, each with an `ActionsOrganizationSecretRepositories` listing the repositories that can read it) and the `repos` stack output, derived from every export of `repos.ts`.

**`gitea/org.ts`** — The `unmango` organization on Gitea, which owns its repositories.

**`gitea/repos.ts`** — Repositories on `gitea.thecluster.io`, through the bridged Terraform provider `@sapslaj/pulumi-gitea`. It has no label resource, so labels there are made through the API.

**`gitea/collaborators.ts`** — Collaborators on Gitea repositories. It is kept apart from `repos.ts` because `gitea/index.ts` treats every export of `repos.ts` as a repository.

### Authentication

Uses GitHub App credentials stored in Pulumi config (`Pulumi.prod.yaml`): app ID `1264044`, installation ID `66536645`. Gitea uses `gitea:baseUrl` and the secret `gitea:token`.

### Stack

Single stack: `UnstoppableMango/unmango-scm/prod`
