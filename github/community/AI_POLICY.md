# AI contribution policy

AI tools are welcome in unmango projects. This policy says what we expect when they are used, so reviewers know what they are looking at and someone stays accountable for every change.

It applies to every contribution: pull requests, issues, and review comments.

## Terms

- An **AI-assisted contribution** is one a human authors and submits, with AI tools helping produce it.
- An **agent contribution** is one an agent authors and opens, with a human only reviewing it.
- **Substantive content** is AI output beyond line-level autocomplete.

## AI-assisted contributions

Anyone may submit an AI-assisted contribution.

- **Disclose it.** If AI produced substantive content in your contribution, say so. In a pull request, tick the AI-assisted box in the template. In an issue or review comment, say so in the text. An `Assisted-by:` or `Co-Authored-By:` commit trailer is welcome but does not replace the disclosure.
- **Own it.** You are accountable for every line you submit. Read it, test it, and be ready to explain any part of it in review. "The AI wrote it" is not an answer to a review question.
- **Keep it focused.** Large, sweeping, or speculative changes are hard to review, whoever wrote them. Open an issue first.

## Agent contributions

Agent contributions are accepted only from agents the maintainers run. In a pull request, they disclose themselves with a `Co-Authored-By:` trailer naming the agent and an attribution block in the description. In an issue or review comment, they say in the text which agent wrote it.

An agent never merges its own work. A human reviews and merges every agent contribution.

If you used an agent to produce a change, submit it as your own AI-assisted contribution: disclose it and take responsibility for it as above. Pull requests opened autonomously by agents we don't run are closed without review.

## AI review bots

Only review bots installed by the maintainers comment on pull requests. Their comments are advisory and never count as a human review.

## When the policy isn't followed

A contribution that should have been disclosed and wasn't is closed with a link to this policy. You're welcome to resubmit it with the disclosure. Contributors who repeatedly ignore the policy, or send bulk low-effort submissions, are blocked.
