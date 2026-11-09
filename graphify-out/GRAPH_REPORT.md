# Graph Report - scm  (2026-11-08)

## Corpus Check
- Corpus is ~7,211 words - fits in a single context window. You may not need a graph.

## Summary
- 208 nodes · 272 edges · 13 communities (12 shown, 1 thin omitted)
- Extraction: 93% EXTRACTED · 6% INFERRED · 1% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.85)
- Token cost: 117,303 input · 0 output

## Community Hubs (Navigation)
- GitHub repo declarations
- Package dependencies
- AI contribution policy
- Repo components
- Org secrets and community files
- CI, auth and Gitea config
- TypeScript config
- Gitea program
- Agent docs and labels
- Rulesets and Pages
- ESLint TypeScript config
- Renovate config
- MCP config

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 12 edges
2. `AI contribution policy (AI_POLICY.md)` - 11 edges
3. `@pulumi/pulumi` - 7 edges
4. `pulumi CI job (pulumi-prod concurrency, thecluster runner)` - 7 edges
5. `Repo` - 6 edges
6. `@pulumi/github` - 6 edges
7. `AGENTS.md (scm)` - 6 edges
8. `Agent contribution` - 6 edges
9. `Disclosure` - 6 edges
10. `ADR 0001: Agents never merge, enforced by policy rather than required approvals` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Review bot` --semantically_similar_to--> `AI review bots (advisory only)`  [INFERRED] [semantically similar]
  CONTEXT.md → github/community/AI_POLICY.md
- `pulumi CI job (pulumi-prod concurrency, thecluster runner)` --shares_data_with--> `Stack UnstoppableMango/unmango-scm/prod`  [INFERRED]
  .github/workflows/ci.yml → AGENTS.md
- `github/labels.ts (ai-assisted, triage, wayfinder labels)` --conceptually_related_to--> `AI disclosure checkbox`  [INFERRED]
  AGENTS.md → github/community/pull_request_template.md
- `pulumi CI job (pulumi-prod concurrency, thecluster runner)` --references--> `dprint formatter`  [EXTRACTED]
  .github/workflows/ci.yml → AGENTS.md
- `pulumi CI job (pulumi-prod concurrency, thecluster runner)` --references--> `Make targets (install, lint, fmt, preview, diff, up, refresh)`  [EXTRACTED]
  .github/workflows/ci.yml → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Agents never merge: policy, written rule on GitHub, Agent account plus merge whitelist on Gitea** — concept_agents_never_merge, docs_adr_0001_agents_never_merge_without_required_approvals_adr, docs_adr_0002_agent_account_enforces_agents_never_merge_on_gitea_adr, docs_adr_0002_agent_account_enforces_agents_never_merge_on_gitea_merge_whitelist, context_agent_account, github_community_ai_policy_ai_contribution_policy [EXTRACTED 1.00]
- **AI disclosure flow across glossary, policy, PR template and labels** — context_disclosure, context_substantive_content, github_community_ai_policy_disclose_own_focus, github_community_pull_request_template_ai_disclosure_checkbox, agents_github_labels_ts [INFERRED 0.85]
- **Community health files committed to unmango/.github** — agents_github_community_ts, github_community_ai_policy_ai_contribution_policy, github_community_contributing_contributing_guide, github_community_pull_request_template_pr_template [EXTRACTED 1.00]

## Communities (13 total, 1 thin omitted)

### Community 0 - "GitHub repo declarations"
Cohesion: 0.05
Nodes (39): github/index.ts (org Actions secrets, repos output), actions, aferox, apis, architecture, charts, clanOperator, cloudflareOperator (+31 more)

### Community 1 - "Package dependencies"
Cohesion: 0.08
Nodes (25): dependencies, @pulumi/github, @pulumi/pulumi, @sapslaj/pulumi-gitea, devDependencies, eslint, @eslint/js, @types/node (+17 more)

### Community 2 - "AI contribution policy"
Cohesion: 0.14
Nodes (20): github/community.ts (commits community health files to unmango/.github), Agent account, Agent contribution, AI-assisted contribution, AI contribution policy (glossary term), Automation account, Contribution, Disclosure (+12 more)

### Community 3 - "Repo components"
Cohesion: 0.15
Nodes (15): LabelArgs, PrivateRepo, PrivateRepoArgs, defaultGitHubChecks, getGitHubStatusChecks(), getRequiredStatusChecks(), integrationIds, PublicRepo (+7 more)

### Community 4 - "Org secrets and community files"
Cohesion: 0.13
Nodes (11): files, config, providerRepos, releaseAppRepoIds, releaseSigningSecrets, repos, dotGithub, terraformProviderAtproto (+3 more)

### Community 5 - "CI, auth and Gitea config"
Cohesion: 0.13
Nodes (12): CI Workflow, pulumi CI job (pulumi-prod concurrency, thecluster runner), Pulumi login via pulumi/auth-actions (OIDC), dprint formatter, gitea/org.ts (unmango Gitea organization), gitea/repos.ts (via @sapslaj/pulumi-gitea), GitHub App authentication (app 1264044, installation 66536645), Make targets (install, lint, fmt, preview, diff, up, refresh) (+4 more)

### Community 6 - "TypeScript config"
Cohesion: 0.13
Nodes (14): compilerOptions, experimentalDecorators, forceConsistentCasingInFileNames, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns, outDir (+6 more)

### Community 7 - "Gitea program"
Cohesion: 0.24
Nodes (7): mveUnstoppableMango, giteaRepos, unmango, defaults, mve, @pulumi/pulumi, @sapslaj/pulumi-gitea

### Community 8 - "Agent docs and labels"
Cohesion: 0.22
Nodes (11): AGENTS.md (scm), github/labels.ts (ai-assisted, triage, wayfinder labels), graphify knowledge graph (graphify-out/), unmango/architecture, unmango-scm Pulumi program (one program for every forge), CLAUDE.md (imports AGENTS.md), Issue tracker: GitHub via gh CLI, PRs as a request surface: no (+3 more)

### Community 9 - "Rulesets and Pages"
Cohesion: 0.28
Nodes (8): main branch ruleset (required PRs, status checks via integration 15368, linear history), PrivateRepo component, PublicRepo component, Repo (abstract base component), RepositoryPages child resource, Branch protection on default branch (README: includes commit signatures, auto-merge enabled), Hercules CI badge, unmango/scm README

### Community 10 - "ESLint TypeScript config"
Cohesion: 0.29
Nodes (6): ./tsconfig.json, compilerOptions, allowJs, noEmit, extends, include

### Community 11 - "Renovate config"
Cohesion: 0.33
Nodes (5): automerge, extends, $schema, github>UnstoppableMango/renovate-config, schedule:monthly

## Ambiguous Edges - Review These
- `Repo (abstract base component)` → `Branch protection on default branch (README: includes commit signatures, auto-merge enabled)`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `main branch ruleset (required PRs, status checks via integration 15368, linear history)` → `Branch protection on default branch (README: includes commit signatures, auto-merge enabled)`  [AMBIGUOUS]
  README.md · relation: semantically_similar_to

## Knowledge Gaps
- **21 isolated node(s):** `github>UnstoppableMango/renovate-config`, `schedule:monthly`, `@types/node`, `typescript`, `./tsconfig.json` (+16 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 118 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `@pulumi/pulumi` connect `Gitea program` to `GitHub repo declarations`, `Package dependencies`, `Repo components`, `Org secrets and community files`?**
  _High betweenness centrality (0.233) - this node is a cross-community bridge._
- **What connects `github>UnstoppableMango/renovate-config`, `schedule:monthly`, `@types/node` to the rest of the system?**
  _21 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `GitHub repo declarations` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Why does `ADR 0002: On Gitea, an Agent account and merge whitelist enforce agents never merge` connect `AI contribution policy` to `CI, auth and Gitea config`, `Gitea program`?**
  _High betweenness centrality (0.171) - this node is a cross-community bridge._
- **Should `Package dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07977207977207977 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Repo (abstract base component)` and `Branch protection on default branch (README: includes commit signatures, auto-merge enabled)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `main branch ruleset (required PRs, status checks via integration 15368, linear history)` and `Branch protection on default branch (README: includes commit signatures, auto-merge enabled)`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._