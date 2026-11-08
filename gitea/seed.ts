import * as gitea from '@sapslaj/pulumi-gitea';

// The org and repository for the Seed (UnstoppableMango/vcs ADR 0002), made
// here because this program already has a Gitea token that can create orgs.
// They belong to the Seed: once it runs, they move into its state the way
// the rest of gitea/ moves to the Forge program, then leave this program.
// The inputs match the Seed's scm.ts so that move changes nothing.
export const scm = new gitea.Org('scm', {
	name: 'scm',
	description: 'IaC for gitea.thecluster.io',
	visibility: 'public',
});

export const seed = new gitea.Repository('seed', {
	username: scm.name,
	name: 'seed',
	description: 'The Seed: what scm/self needs before it can run',
	private: false,
	// Empty, so the Seed's code can be pushed as its first commit.
	autoInit: false,
	defaultBranch: 'main',
	allowManualMerge: false,
	allowMergeCommits: false,
	allowRebase: false,
	allowRebaseExplicit: false,
	allowSquashMerge: true,
	defaultMergeStyle: 'squash',
	hasIssues: true,
	hasProjects: false,
	hasPullRequests: true,
	hasWiki: false,
	archiveOnDestroy: true,
});

// Gitea makes an Owners team in every new org, holding only the org's creator,
// which is this program's token user. Erik joins it through his GitHub-linked
// account so he can work in the org.
const scmOwners = gitea.getTeamsOutput({ organisation: scm.name }).apply(({ teams }) => {
	const owners = teams.find(t => t.name === 'Owners');
	if (owners?.id === undefined) throw new Error('the scm org has no Owners team');
	return owners.id;
});

export const scmOwnersUnstoppableMango = new gitea.TeamMembership('scm-owners-UnstoppableMango', {
	teamId: scmOwners,
	username: 'UnstoppableMango',
});
