import * as gitea from '@sapslaj/pulumi-gitea';
import { mve } from './repos';

// People with access to private repositories on gitea.thecluster.io.
// Write access is enough to push branches and work through pull requests.
export const mveUnstoppableMango = new gitea.RepositoryCollaborator('mve-UnstoppableMango', {
	owner: mve.username,
	repo: mve.name,
	username: 'UnstoppableMango',
	permission: 'write',
});
