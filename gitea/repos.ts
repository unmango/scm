import * as gitea from '@sapslaj/pulumi-gitea';
import { unmango } from './org';

// Repositories on gitea.thecluster.io. The settings follow github/components/repo.ts
// with squash merges only. The provider has no option to delete a branch after its
// pull request merges, so that stays as the Gitea default.
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
	username: unmango.name,
	name: 'mve',
	description: 'Mass video editing: tag long stream recordings and prune them for storage',
	private: true,
	autoInit: true,
	defaultBranch: 'main',
});
