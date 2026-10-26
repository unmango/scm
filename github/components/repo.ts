import * as gh from '@pulumi/github';
import { ComponentResource, ComponentResourceOptions, CustomResourceOptions, Input } from '@pulumi/pulumi';

export interface RepoArgs {
	overrides: Partial<gh.RepositoryArgs>;
	/**
	 * Options for the repository resource itself, on top of its parent. It is how
	 * a repository that already exists on GitHub is adopted: an import, or an
	 * alias for one whose URN is moving.
	 */
	repoOptions?: CustomResourceOptions;
	/** Whether Dependabot raises alerts for the repository. Defaults to enabled. */
	vulnerabilityAlerts?: Input<boolean>;
	/** Issue labels to manage on the repository, keyed by label name. */
	labels?: Record<string, IssueLabel>;
}

export interface IssueLabel {
	/** Hex color without the leading `#`. */
	color: Input<string>;
	description?: Input<string>;
}

export abstract class Repo extends ComponentResource {
	public readonly repo!: gh.Repository;
	public readonly vulnerabilityAlerts!: gh.RepositoryVulnerabilityAlerts;
	public readonly labels!: gh.IssueLabel[];

	constructor(type: string, name: string, args: RepoArgs, opts?: ComponentResourceOptions) {
		super(type, name, args, opts);
		if (opts?.urn) return; // Refreshing

		const repo = new gh.Repository(name, {
			// I think this isn't allowed for private repos
			allowAutoMerge: false,
			allowMergeCommit: false,
			allowRebaseMerge: false,
			allowSquashMerge: true,
			deleteBranchOnMerge: true,
			hasDiscussions: false,
			hasIssues: true,
			hasProjects: false,
			hasWiki: false,
			licenseTemplate: 'mit',
			squashMergeCommitMessage: 'COMMIT_MESSAGES',
			squashMergeCommitTitle: 'COMMIT_OR_PR_TITLE',
			...args.overrides,
		}, { parent: this, ...args.repoOptions });

		const vulnerabilityAlerts = new gh.RepositoryVulnerabilityAlerts(name, {
			repository: repo.name,
			enabled: args.vulnerabilityAlerts,
		}, {
			parent: this,
			// Renaming the repository replaces this resource. Created first, the old
			// one's delete would disable alerts again through GitHub's rename redirect.
			deleteBeforeReplace: true,
		});

		const labels = Object.entries(args.labels ?? {}).map(([label, { color, description }]) =>
			new gh.IssueLabel(`${name}-${label}`, {
				repository: repo.name,
				name: label,
				color,
				description,
			}, {
				parent: this,
				// Renaming the repository replaces each label, and GitHub carries the
				// labels over. Created first, the old one's delete would remove it again.
				deleteBeforeReplace: true,
			})
		);

		this.repo = repo;
		this.vulnerabilityAlerts = vulnerabilityAlerts;
		this.labels = labels;
	}
}
