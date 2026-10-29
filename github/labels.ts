import type { IssueLabel } from './components/repo';

/**
 * The triage roles the engineering agent skills apply, for repositories whose
 * `docs/agents/triage-labels.md` keeps the default names. Every repository gets
 * them unless it opts out. `wontfix` is left out because GitHub creates it with
 * every repository.
 */
export const triageLabels: Record<string, IssueLabel> = {
	'needs-triage': { color: 'fbca04', description: 'Maintainer needs to evaluate this issue' },
	'needs-info': { color: 'd876e3', description: 'Waiting on reporter for more information' },
	'ready-for-agent': { color: '0e8a16', description: 'Fully specified, ready for an AFK agent' },
	'ready-for-human': { color: '1d76db', description: 'Requires human implementation' },
};

/**
 * The ticket types the wayfinder agent skill charts a map with: `map` marks the
 * map issue itself, and each child ticket carries one of the others. Every
 * repository gets them unless it opts out. Kept in step with
 * UnstoppableMango/vcs's github/repositories/labels.ts.
 */
export const wayfinderLabels: Record<string, IssueLabel> = {
	// Matches the label as it was made by hand, so the import in index.ts adopts
	// it unchanged.
	'wayfinder:map': { color: 'ededed' },
	'wayfinder:research': { color: 'c5def5', description: 'Wayfinder ticket resolved by reading sources (AFK)' },
	'wayfinder:prototype': {
		color: 'bfd4f2',
		description: 'Wayfinder ticket resolved by reacting to a rough artifact (HITL)',
	},
	'wayfinder:grilling': { color: 'd4c5f9', description: 'Wayfinder ticket resolved in conversation (HITL)' },
	'wayfinder:task': { color: 'fef2c0', description: 'Wayfinder ticket for work a decision waits on' },
};
