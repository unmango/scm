# On Gitea, an Agent account and a merge whitelist enforce "agents never merge"

ADR 0001 left "agents never merge" as a written rule because **Maintainer agents** pushed as the maintainer's own account. On Gitea, a **Maintainer agent** acts as its own **Agent account** instead, and `main`'s branch protection has a merge whitelist that lists only the maintainer. The **Agent account** can push branches, open pull requests and comment, but Gitea refuses its merges. Required approvals stay at zero, because Gitea, like GitHub, won't let an author approve their own pull request, and the maintainer's solo pull requests would be blocked.

The **Agent account** is a restricted, token-only local user. It reaches the `unmango` org's repositories through a team with write access, plus private repositories granted to it one at a time. Its commits are authored as its own noreply address, and still carry the co-author trailer and PR attribution block that **Disclosure** asks for.

## Considered options

- **Require one approval.** Blocks the maintainer's own pull requests, as in ADR 0001.
- **Keep the written rule and let the agent push as the maintainer.** No mechanical enforcement, and agent work can't be told apart from the maintainer's own.
- **Agent account plus a merge whitelist.** Chosen. Enforcement depends on who is pushing, not on the approval count.

GitHub is unchanged: Claude sessions there still push as the maintainer, and ADR 0001 still applies.
