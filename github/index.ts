import * as gh from '@pulumi/github';
import { Config, output } from '@pulumi/pulumi';
import { disclosureLabels, triageLabels, wayfinderLabels } from './labels';
import './community';
import * as allRepos from './repos';
import { terraformProviderAtproto, terraformProviderNetgear } from './repos';

// The Terraform Registry checks provider releases against every key registered on
// the namespace, so one key signs them all. The registry accepts RSA and DSA keys only.
const config = new Config();
const providerRepos = [terraformProviderAtproto, terraformProviderNetgear];
const releaseSigningSecrets = {
	GPG_PRIVATE_KEY: config.requireSecret('releaseGpgPrivateKey'),
	PASSPHRASE: config.requireSecret('releaseGpgPassphrase'),
};
for (const [secretName, plaintextValue] of Object.entries(releaseSigningSecrets)) {
	new gh.ActionsOrganizationSecret(secretName, {
		secretName,
		plaintextValue,
		visibility: 'selected',
		selectedRepositoryIds: providerRepos.map(x => x.repo.repoId),
	});
}

// release-please tags releases with the release app's token, because a tag pushed
// with GITHUB_TOKEN does not start the workflow that publishes the release: goreleaser
// for the providers, the chart and image for wishlists. wishlists isn't declared in
// repos.ts yet, so its ID is looked up.
const wishlists = gh.getRepositoryOutput({ fullName: 'unmango/wishlists' });
const releaseAppRepoIds = [...providerRepos.map(x => x.repo.repoId), wishlists.repoId];
new gh.ActionsOrganizationVariable('RELEASE_APP_CLIENT_ID', {
	variableName: 'RELEASE_APP_CLIENT_ID',
	value: config.require('releaseAppClientId'),
	visibility: 'selected',
	selectedRepositoryIds: releaseAppRepoIds,
});
new gh.ActionsOrganizationSecret('RELEASE_APP_PRIVATE_KEY', {
	secretName: 'RELEASE_APP_PRIVATE_KEY',
	plaintextValue: config.requireSecret('releaseAppPrivateKey'),
	visibility: 'selected',
	selectedRepositoryIds: releaseAppRepoIds,
});

// wishlists isn't declared in repos.ts yet, so its labels stand alone until it
// is adopted. `wayfinder:map` was made by hand before the rest.
const wishlistsLabelImports: Record<string, string> = {
	'wayfinder:map': 'wishlists:wayfinder:map',
};
const wishlistsLabels = { ...disclosureLabels, ...triageLabels, ...wayfinderLabels };
for (const [name, { color, description }] of Object.entries(wishlistsLabels)) {
	const id = wishlistsLabelImports[name];
	new gh.IssueLabel(`wishlists-${name}`, {
		repository: 'wishlists',
		name,
		color,
		description,
	}, id ? { import: id } : undefined);
}

export const repos = output(Object.values(allRepos).map(x => x.repo.name)).apply(names => [...names].sort());
