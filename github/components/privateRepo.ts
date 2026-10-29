import { ComponentResourceOptions, Input } from '@pulumi/pulumi';
import { Repo, RepoArgs } from './repo';

export interface PrivateRepoArgs extends Pick<RepoArgs, 'triageLabels' | 'wayfinderLabels' | 'labelImports'> {
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
