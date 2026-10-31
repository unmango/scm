import * as gh from '@pulumi/github';
import { ComponentResource, ComponentResourceOptions, CustomResourceOptions, Input } from '@pulumi/pulumi';
import { disclosureLabels, triageLabels, wayfinderLabels } from '../labels';

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
	/** Whether the repository gets the AI contribution disclosure labels. Defaults to true. */
	disclosureLabels?: boolean;
	/** Whether the repository gets the triage labels. Defaults to true. */
	triageLabels?: boolean;
	/** Whether the repository gets the wayfinder labels. Defaults to true. */
	wayfinderLabels?: boolean;
	/** Import IDs (`<repo>:<label>`) of labels made by hand, keyed by label. */
	labelImports?: Record<string, string>;
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

		const allLabels = {
			...(args.disclosureLabels === false ? {} : disclosureLabels),
			...(args.triageLabels === false ? {} : triageLabels),
			...(args.wayfinderLabels === false ? {} : wayfinderLabels),
			...args.labels,
		};
		const labels = Object.entries(allLabels).map(([label, { color, description }]) => {
			const id = args.labelImports?.[label];
			return new gh.IssueLabel(`${name}-${label}`, {
				repository: repo.name,
				name: label,
				color,
				description,
			}, {
				parent: this,
				// Renaming the repository replaces each label, and GitHub carries the
				// labels over. Created first, the old one's delete would remove it again.
				deleteBeforeReplace: true,
				// An import fails unless its inputs match the label as it is, and a
				// hand-made label's look is whatever it was made with. Adopt it as is;
				// once the import is dropped, the next up brings it in line.
				...(id && { import: id, ignoreChanges: ['color', 'description'] }),
			});
		});

		this.repo = repo;
		this.vulnerabilityAlerts = vulnerabilityAlerts;
		this.labels = labels;
	}
}
