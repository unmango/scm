import { IssueLabel } from './components/repo';

/**
 * The triage roles the engineering agent skills apply, for repositories whose
 * `docs/agents/triage-labels.md` keeps the default names. `wontfix` is left out
 * because GitHub creates it with every repository.
 */
export const triageLabels: Record<string, IssueLabel> = {
	'needs-triage': { color: 'fbca04', description: 'Maintainer needs to evaluate this issue' },
	'needs-info': { color: 'd876e3', description: 'Waiting on reporter for more information' },
	'ready-for-agent': { color: '0e8a16', description: 'Fully specified, ready for an AFK agent' },
	'ready-for-human': { color: '1d76db', description: 'Requires human implementation' },
};

/**
 * The ticket types the wayfinder agent skill charts a map with: `map` marks the
 * map issue itself, and each child ticket carries one of the others.
 */
export const wayfinderLabels: Record<string, IssueLabel> = {
	// Matches the label as it was made by hand, so the import in index.ts adopts
	// it unchanged.
	'wayfinder:map': { color: 'ededed' },
	'wayfinder:research': { color: 'c5def5', description: 'Wayfinder ticket: surface a fact a decision waits on' },
	'wayfinder:prototype': { color: 'bfd4f2', description: 'Wayfinder ticket: a rough artifact to react to' },
	'wayfinder:grilling': { color: 'd4c5f9', description: 'Wayfinder ticket: decided in conversation' },
	'wayfinder:task': { color: 'fef2c0', description: 'Wayfinder ticket: work that unblocks a decision' },
};
