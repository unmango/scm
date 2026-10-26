import * as gh from '@pulumi/github';
import {
	RepositoryPages,
	RepositoryRulesetRules,
	RepositoryRulesetRulesRequiredStatusChecks,
	RepositoryTemplate,
} from '@pulumi/github/types/input';
import { ComponentResourceOptions, CustomResourceOptions, Input, output } from '@pulumi/pulumi';
import { IssueLabel, Repo } from './repo';

const integrationIds = {
	github: 15368,
};

export interface PublicRepoArgs {
	description: Input<string>;
	/**
	 * The name of the repository on GitHub, when it differs from the Pulumi
	 * resource name. Renaming the resource itself would change its URN and each
	 * child resource's URN, which Pulumi would carry out as a delete and recreate.
	 */
	repoName?: Input<string>;
	/**
	 * Names of the GitHub Actions checks the main ruleset requires. When neither
	 * this nor requiredChecks is given, the ruleset requires one check named
	 * `required`: a gate job at the end of the repository's CI that fails when any
	 * job it needs did, so the repository decides what blocks a merge by editing
	 * that job's needs. An empty list requires nothing.
	 */
	githubChecks?: Input<Input<string>[]>;
	requiredChecks?: RepositoryRulesetRulesRequiredStatusChecks['requiredChecks'];
	template?: RepositoryTemplate;
	pages?: RepositoryPages;
	topics?: Input<Input<string>[]>;
	/** Passed through to the repository resource, for adopting one that already exists. */
	repoOptions?: CustomResourceOptions;
	/** Passed through to the `main` ruleset resource, for adopting one that already exists. */
	rulesetOptions?: CustomResourceOptions;
	/** Whether Dependabot raises alerts for the repository. Defaults to enabled. */
	vulnerabilityAlerts?: Input<boolean>;
	/** Issue labels to manage on the repository, keyed by label name. */
	labels?: Record<string, IssueLabel>;
}

export class PublicRepo extends Repo {
	public readonly mainRuleset!: gh.RepositoryRuleset;

	constructor(
		name: string,
		args: PublicRepoArgs,
		opts?: ComponentResourceOptions,
	) {
		super(
			'unmango:github:PublicRepo',
			name,
			{
				overrides: {
					name: args.repoName ?? name,
					description: args.description,
					visibility: 'public',
					allowAutoMerge: true,
					template: args.template,
					pages: args.pages,
					topics: args.topics,
				},
				repoOptions: args.repoOptions,
				vulnerabilityAlerts: args.vulnerabilityAlerts,
				labels: args.labels,
			},
			opts,
		);

		if (opts?.urn) return; // Refreshing

		const repo = this.repo;
		const vulnerabilityAlerts = this.vulnerabilityAlerts;
		const labels = this.labels;
		const statusChecks = args.requiredChecks
			? getRequiredStatusChecks(args.requiredChecks)
			: getGitHubStatusChecks(args.githubChecks ?? defaultGitHubChecks);

		const mainRuleset = new gh.RepositoryRuleset(
			name,
			{
				name: 'main',
				repository: repo.name,
				enforcement: 'active',
				target: 'branch',
				conditions: {
					refName: {
						includes: ['~DEFAULT_BRANCH'],
						excludes: [],
					},
				},
				rules: {
					deletion: true,
					pullRequest: {
						dismissStaleReviewsOnPush: true,
						requiredReviewThreadResolution: true,
					},
					nonFastForward: true,
					requiredLinearHistory: true,
					requiredStatusChecks: statusChecks,
				},
			},
			{ parent: this, ...args.rulesetOptions },
		);

		this.mainRuleset = mainRuleset;

		this.registerOutputs({
			repo,
			mainRuleset,
			vulnerabilityAlerts,
			labels,
		});
	}
}

// The check every repository's CI ends in unless it says otherwise.
const defaultGitHubChecks = ['required'];

function getGitHubStatusChecks(
	checks: PublicRepoArgs['githubChecks'],
): RepositoryRulesetRules['requiredStatusChecks'] {
	if (!checks) return;

	return getRequiredStatusChecks(
		output(checks).apply(c =>
			c.map(x => ({
				integrationId: integrationIds.github,
				context: x,
			}))
		),
	);
}

function getRequiredStatusChecks(
	checks: PublicRepoArgs['requiredChecks'],
): RepositoryRulesetRules['requiredStatusChecks'] {
	if (!checks) return;

	// An empty list means no checks are required, which is the absence of the
	// rule rather than a rule listing nothing.
	return output(checks).apply(c => c.length > 0 ? { requiredChecks: c } : undefined);
}
