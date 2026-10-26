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
