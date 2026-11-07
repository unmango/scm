import * as gh from '@pulumi/github';
import { Config, Input, output } from '@pulumi/pulumi';
import './community';
import * as allRepos from './repos';
import { terraformProviderAtproto, terraformProviderNetgear, wishlists } from './repos';

// The Terraform Registry checks provider releases against every key registered on
// the namespace, so one key signs them all. The registry accepts RSA and DSA keys only.
const config = new Config();
const providerRepos = [terraformProviderAtproto, terraformProviderNetgear];
const releaseSigningSecrets = {
	GPG_PRIVATE_KEY: config.requireSecret('releaseGpgPrivateKey'),
	PASSPHRASE: config.requireSecret('releaseGpgPassphrase'),
};
for (const [name, value] of Object.entries(releaseSigningSecrets)) {
	selectedOrgSecret(name, value, providerRepos.map(x => x.repo.repoId));
}

// release-please tags releases with the release app's token, because a tag pushed
// with GITHUB_TOKEN does not start the workflow that publishes the release: goreleaser
// for the providers, the chart and image for wishlists.
const releaseAppRepoIds = [...providerRepos, wishlists].map(x => x.repo.repoId);
new gh.ActionsOrganizationVariable('RELEASE_APP_CLIENT_ID', {
	variableName: 'RELEASE_APP_CLIENT_ID',
	value: config.require('releaseAppClientId'),
	visibility: 'selected',
	selectedRepositoryIds: releaseAppRepoIds,
});
selectedOrgSecret('RELEASE_APP_PRIVATE_KEY', config.requireSecret('releaseAppPrivateKey'), releaseAppRepoIds);

export const repos = output(Object.values(allRepos).map(x => x.repo.name)).apply(names => [...names].sort());

// An Actions secret only the given repositories can read. Which repositories
// those are is its own resource, as the provider no longer takes them on the secret.
function selectedOrgSecret(name: string, value: Input<string>, repoIds: Input<Input<number>[]>) {
	const secret = new gh.ActionsOrganizationSecret(name, {
		secretName: name,
		value,
		visibility: 'selected',
	});
	new gh.ActionsOrganizationSecretRepositories(name, {
		secretName: secret.secretName,
		selectedRepositoryIds: repoIds,
	});
}
