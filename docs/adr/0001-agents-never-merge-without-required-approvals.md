# Agents never merge, enforced by policy rather than required approvals

The `main` ruleset on public repos requires a pull request but zero approving reviews. The **AI contribution policy** needs every **Agent contribution** merged by a human, and the obvious enforcement is requiring one approval. We don't do that: there is a single maintainer, GitHub won't let an author approve their own PR, and **Maintainer agents** (Claude sessions) push as the maintainer's own account, so a required approval would block every solo PR without telling agent work apart from human work. "Agents never merge" stays a written rule instead.

## Considered options

- **Require one approval.** Blocks the maintainer's own PRs; no second reviewer exists.
- **Require approval only for bot authors.** Rulesets can't condition on author, and agents don't push as a bot today.
- **Written rule now, identity-based enforcement later.** Chosen. If agents move to a bot identity with no ruleset bypass, the rule can become mechanical without touching the approval count.
