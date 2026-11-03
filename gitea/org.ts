import * as gitea from '@sapslaj/pulumi-gitea';

// The organization that owns every unmango repository on gitea.thecluster.io.
export const unmango = new gitea.Org('unmango', {
	name: 'unmango',
	description: 'Source control for unmango projects',
	visibility: 'public',
});
