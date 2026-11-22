import * as gh from '@pulumi/github';
import {
	RepositoryPages,
	RepositoryRulesetBypassActor,
	RepositoryRulesetRules,
	RepositoryRulesetRulesRequiredStatusChecks,
	RepositoryTemplate,
} from '@pulumi/github/types/input';
import { ComponentResourceOptions, CustomResourceOptions, Input, output } from '@pulumi/pulumi';
import { ForkPrApproval } from './forkPrApproval';
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
	/** Requires only the `required` check, whatever githubChecks and requiredChecks say. */
	requiredGate?: boolean;
	template?: RepositoryTemplate;
	/** Whether GitHub makes an initial commit, so the default branch exists for files committed by this program. */
	autoInit?: Input<boolean>;
	/** The repository's GitHub Pages site, managed as its own resource. */
	pages?: RepositoryPages;
	/** Passed through to the Pages resource, for adopting a site that already exists. */
	pagesOptions?: CustomResourceOptions;
	topics?: Input<Input<string>[]>;
	/** Passed through to the repository resource, for adopting one that already exists. */
	repoOptions?: CustomResourceOptions;
	/**
	 * Actors that may bypass the `main` ruleset, such as an app that commits files
	 * to it directly, on top of repository admins merging a pull request.
	 */
	rulesetBypassActors?: Input<Input<RepositoryRulesetBypassActor>[]>;
	/** Passed through to the `main` ruleset resource, for adopting one that already exists. */
	rulesetOptions?: CustomResourceOptions;
	/** Whether Dependabot raises alerts for the repository. Defaults to enabled. */
	vulnerabilityAlerts?: Input<boolean>;
	/** Issue labels to manage on the repository, keyed by label name. */
	labels?: Record<string, IssueLabel>;
	/** Whether the repository gets the AI contribution disclosure labels. Defaults to true. */
	disclosureLabels?: boolean;
	/** Whether the repository gets the triage labels. Defaults to true. */
	triageLabels?: boolean;
	/** Whether the repository gets the wayfinder labels. Defaults to true. */
	wayfinderLabels?: boolean;
	/** Import IDs (`<repo>:<label>`) of labels made by hand, keyed by label. */
	labelImports?: Record<string, string>;
}

export class PublicRepo extends Repo {
	public readonly mainRuleset!: gh.RepositoryRuleset;
	public readonly forkPrApproval!: ForkPrApproval;
	public readonly pages?: gh.RepositoryPages;

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
					autoInit: args.autoInit,
					topics: args.topics,
				},
				repoOptions: args.repoOptions,
				vulnerabilityAlerts: args.vulnerabilityAlerts,
				labels: args.labels,
				disclosureLabels: args.disclosureLabels,
				triageLabels: args.triageLabels,
				wayfinderLabels: args.wayfinderLabels,
				labelImports: args.labelImports,
			},
			opts,
		);

		if (opts?.urn) return; // Refreshing

		const repo = this.repo;
		const vulnerabilityAlerts = this.vulnerabilityAlerts;
		const labels = this.labels;
		const statusChecks = getStatusChecks(args);

		const mainRuleset = new gh.RepositoryRuleset(
			name,
			{
				name: 'main',
				repository: repo.name,
				enforcement: 'active',
				target: 'branch',
				bypassActors: output(args.rulesetBypassActors ?? []).apply(x => [adminBypass, ...x]),
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

		const forkPrApproval = new ForkPrApproval(name, {
			repository: repo.name,
			approvalPolicy: 'all_external_contributors',
		}, { parent: this });

		const pages = args.pages && new gh.RepositoryPages(name, {
			repository: repo.name,
			buildType: args.pages.buildType,
			cname: args.pages.cname,
			source: args.pages.source,
		}, {
			parent: this,
			// Renaming the repository replaces this resource. Created first, enabling
			// Pages would fail on a site that exists, and the old one's delete would
			// disable it again through GitHub's rename redirect.
			deleteBeforeReplace: true,
			...args.pagesOptions,
		});

		this.mainRuleset = mainRuleset;
		this.forkPrApproval = forkPrApproval;
		this.pages = pages;

		this.registerOutputs({
			repo,
			mainRuleset,
			forkPrApproval,
			pages,
			vulnerabilityAlerts,
			labels,
		});
	}
}

// The way through an outage of a required check.
const adminBypass: RepositoryRulesetBypassActor = {
	actorType: 'RepositoryRole',
	actorId: 5, // Admin
	bypassMode: 'pull_request',
};

// The check every repository's CI ends in unless it says otherwise.
const defaultGitHubChecks = ['required'];

function getStatusChecks(args: PublicRepoArgs): RepositoryRulesetRules['requiredStatusChecks'] {
	if (args.requiredGate) return getGitHubStatusChecks(defaultGitHubChecks);
	if (args.requiredChecks) return getRequiredStatusChecks(args.requiredChecks);
	return getGitHubStatusChecks(args.githubChecks ?? defaultGitHubChecks);
}

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
