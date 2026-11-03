import * as gitea from '@sapslaj/pulumi-gitea';

// Repositories on gitea.thecluster.io. The settings follow github/components/repo.ts:
// squash merges only, and the branch goes once its pull request merges.
const defaults: Partial<gitea.RepositoryArgs> = {
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
	// A destroy archives the repository instead of deleting it.
	archiveOnDestroy: true,
};

// Private: it works on recordings of other people's live streams.
export const mve = new gitea.Repository('mve', {
	...defaults,
	username: 'unmango',
	name: 'mve',
	description: 'Mass video editing: tag long stream recordings and prune them for storage',
	private: true,
	autoInit: true,
	defaultBranch: 'main',
});
