import * as gitea from '@sapslaj/pulumi-gitea';
import { unmango } from './org';

// Agent accounts reach every unmango repository through this team. The Seed
// (scm/seed) creates the accounts themselves. Branch protection
// (protection.ts) keeps them from merging or pushing to main.
export const agents = new gitea.Team('agents', {
	organisation: unmango.name,
	name: 'agents',
	description: 'Agent accounts: push branches and open pull requests, never merge',
	permission: 'write',
	includeAllRepositories: true,
	canCreateRepos: false,
});

export const agentsMembers = new gitea.TeamMembers('agents', {
	teamId: agents.id.apply(Number),
	members: ['claude'],
});
