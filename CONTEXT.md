# unmango source control

How the unmango repositories are hosted, governed, and contributed to.

## Language

### Contributions

**Contribution**:
A change, issue, or review comment submitted to an unmango repository.

**AI-assisted contribution**:
A **Contribution** a human authors and submits, with AI tools helping produce it. The human submitter is accountable for every line.
_Avoid_: AI contribution, AI-generated PR

**Agent contribution**:
A **Contribution** an agent authors and opens, with a human only reviewing it.
_Avoid_: AI contribution, bot PR

**Disclosure**:
The submitter's statement that a **Contribution** is an **AI-assisted contribution** or an **Agent contribution**.

**Substantive content**:
AI output beyond line-level autocomplete. Its presence in a **Contribution** is what makes **Disclosure** required.

**Maintainer agent**:
An agent the maintainer runs, such as a Claude session, the thecluster-bot app, or an AFK agent working a `ready-for-agent` issue. Only a **Maintainer agent** may make an **Agent contribution**.
_Avoid_: bot, our agents

**Review bot**:
An AI reviewer installed at the org level. Its comments are advisory and never count as human review.

**AI contribution policy**:
The org-wide rules for **AI-assisted contributions** and **Agent contributions**, written so they don't depend on any one forge.

## Relationships

- Every **AI-assisted contribution** and **Agent contribution** carries a **Disclosure**
- A **Contribution** with **Substantive content** from AI is an **AI-assisted contribution** or an **Agent contribution**; one without is neither
- An **Agent contribution** comes from a **Maintainer agent**; an outside human who used an agent submits an **AI-assisted contribution** instead
- An **Agent contribution** is merged by a human, never by the agent
- An undisclosed **AI-assisted contribution** or **Agent contribution** is closed with a link to the **AI contribution policy**
- The **AI contribution policy** governs outside contributors and the agents the maintainer runs; forge AI features are settings derived from it, not part of it

## Flagged ambiguities

- "AI contribution" was used for both **AI-assisted contribution** and **Agent contribution**. Resolved: they are distinct, because the policy treats them differently.
