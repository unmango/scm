import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { Repo, RepoArgs } from './repo';

type LabelArgs = 'disclosureLabels' | 'triageLabels' | 'wayfinderLabels' | 'labelImports';

export interface PrivateRepoArgs extends Pick<RepoArgs, LabelArgs> {
	description: Input<string>;
}

export class PrivateRepo extends Repo {
	constructor(name: string, args: PrivateRepoArgs, opts?: ComponentResourceOptions) {
		super('unmango:github:PrivateRepo', name, {
			overrides: {
				name,
				description: args.description,
				visibility: 'private',
			},
			disclosureLabels: args.disclosureLabels,
			triageLabels: args.triageLabels,
			wayfinderLabels: args.wayfinderLabels,
			labelImports: args.labelImports,
		}, opts);

		if (opts?.urn) return; // Refreshing

		const repo = this.repo;
		const vulnerabilityAlerts = this.vulnerabilityAlerts;
		const labels = this.labels;

		this.registerOutputs({ repo, vulnerabilityAlerts, labels });
	}
}
