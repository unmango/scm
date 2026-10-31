import { RepositoryPages } from '@pulumi/github/types/input';
import { PrivateRepo, PublicRepo } from './components';

const legacyGhPages: RepositoryPages = {
	buildType: 'legacy',
	cname: '',
	source: {
		branch: 'gh-pages',
		path: '/',
	},
};

export const actions = new PublicRepo('actions', {
	description: 'Blessed GitHub Actions',
	githubChecks: ['check'],
});

export const aferox = new PublicRepo('aferox', {
	description: 'Implementations and utilities for github.com/spf13/afero',
	githubChecks: ['Build and Test'],
});

export const apis = new PublicRepo('apis', {
	description: 'Public API definitions',
	topics: ['api', 'protobuf', 'grpc', 'openapi'],
	githubChecks: ['check'],
});

// Private: it describes home hardware and network layout.
export const architecture = new PrivateRepo('architecture', {
	description: 'Models of unmango repositories, running software, hardware, network, and plans for change',
});

export const charts = new PublicRepo('charts', {
	description: 'Smörgåsbord of Helm charts',
	githubChecks: ['lint'],
	pages: legacyGhPages,
});

export const cloudflareOperator = new PublicRepo('cloudflare-operator', {
	description: 'Manage Cloudflare infrastructure in Kubernetes',
	githubChecks: ['build', 'lint', 'test'],
	pages: legacyGhPages,
});

export const containers = new PublicRepo('containers', {
	description: 'Smörgåsbord of OCI containers',
	topics: ['docker', 'oci', 'containers', 'ghcr', 'container-registry'],
	// One summary job per workflow: `build` ends CI, `image` ends Images. Both
	// need every other job in their workflow. The real work runs in matrices
	// over systems and images, which report a context per leg and cannot be
	// required here without naming each one.
	githubChecks: ['build', 'image'],
});

export const devctl = new PublicRepo('devctl', {
	description: 'Dev productivity CLI',
	githubChecks: ['build'],
});

export const enclave = new PublicRepo('enclave', {
	description: 'Manage development environments in Kubernetes',
	topics: ['kubernetes', 'operator', 'development-environment', 'kubebuilder', 'go'],
	githubChecks: ['build', 'lint', 'test'],
});

export const game = new PublicRepo('game', {
	description: 'A gaming framework',
	githubChecks: ['Build and Test'],
	// The architecture site, deployed by the repository's pages workflow.
	pages: { buildType: 'workflow' },
});

export const go = new PublicRepo('go', {
	description: 'Random Go crap',
	githubChecks: ['Build and Test'],
});

export const goMake = new PublicRepo('go-make', {
	description: 'Makefile parsing library for Go',
	githubChecks: ['Build and Test'],
});

export const goPrivateInternetAccess = new PublicRepo('go-pia', {
	description: 'Private Internet Access client and utilities in Go',
	githubChecks: ['Build and Test'],
});

// Keep the Pulumi resource name as "gnumake-go" to preserve URNs; the GitHub repo is renamed via repoName.
export const goGmk = new PublicRepo('gnumake-go', {
	repoName: 'go-gmk',
	description: 'Go bindings for the GNU Make loadable object API',
	githubChecks: ['build'],
	topics: ['go', 'make', 'gnumake', 'cgo', 'plugin'],
});

export const kubepkgs = new PublicRepo('kubepkgs', {
	description: 'Nix packaged Kubernetes components and utilities',
	githubChecks: ['build'],
});

export const kubebuilder = new PublicRepo('kubebuilder', {
	description: 'Collection of kubebuilder plugins',
	githubChecks: ['build', 'lint', 'clean'],
});

export const kubebuilderNix = new PublicRepo('kubebuilder-nix', {
	description: 'Nix builders for Kubebuilder scaffolds and upgrades',
	topics: ['nix', 'kubebuilder', 'kubernetes', 'operator'],
	githubChecks: ['build'],
});

export const nift = new PublicRepo('nift', {
	description: 'True templating for nix flake templates, with variable replacement',
	topics: ['nix', 'nix-flake', 'templates', 'scaffolding'],
	githubChecks: ['check'],
});

export const nix2git = new PublicRepo('nix2git', {
	description: 'Nix support for initializing and managing git repositories',
	topics: ['nix', 'git', 'nix-flake', 'home-manager'],
	githubChecks: ['check'],
	// Moved from gitlab.com/unmango/nix/2git, so the repository already exists.
	repoOptions: { import: 'nix2git' },
});

export const notsystemd = new PublicRepo('notsystemd', {
	description: 'Pod-native stand-in for systemd, for software that expects to run under it',
	topics: ['systemd', 'kubernetes', 'containers', 'dbus', 'sd-notify', 'go'],
});

export const palworldOperator = new PublicRepo('palworld-operator', {
	description: 'Manage Palworld servers in Kubernetes',
	topics: ['kubernetes', 'operator', 'palworld', 'kubebuilder', 'go'],
	githubChecks: ['build', 'lint', 'test'],
	pages: legacyGhPages,
});

export const protofs = new PublicRepo('protofs', {
	description: 'Protobuf definitions for filesystem abstractions',
	githubChecks: ['buf'],
});

export const pulumiBaremetal = new PublicRepo('pulumi-baremetal', {
	description: 'Pulumi bare-metal provisioning provider',
	template: { owner: 'pulumi', repository: 'pulumi-provider-boilerplate' },
	githubChecks: ['Provisioner', 'Provider', 'Tests'],
});

export const pulumipkgs = new PublicRepo('pulumipkgs', {
	description: 'Pulumi, providers, and plugins packaged for Nix',
	topics: ['nix', 'nixpkgs', 'nix-flake', 'pulumi'],
	githubChecks: ['build'],
});

export const pkgs = new PublicRepo('pkgs', {
	description: 'Mini nixpkgs — personal Nix package collection',
	topics: ['nix', 'nixpkgs', 'nix-flake'],
	githubChecks: ['build (x86_64-linux)'],
	// Lockfiles under pkgs/ record what upstream projects pin, not what this
	// repo depends on. Their advisories are unactionable here and accumulate
	// with every package added.
	vulnerabilityAlerts: false,
});

export const s4 = new PublicRepo('s4', {
	description: 'A simple S3 that runs anywhere: shell, container, browser, Aspire, or in process',
	topics: ['s3', 'object-storage', 'testing', 'wasm', 'aspire'],
});

export const scm = new PublicRepo('scm', {
	description: 'unmango source control infrastructure',
	topics: ['pulumi', 'iac', 'github'],
	githubChecks: ['pulumi'],
});

export const slip = new PublicRepo('slip', {
	description: 'Capture a thought into a zettel with as little ceremony as possible',
	topics: ['zettelkasten', 'notes', 'knowledge-management', 'markdown', 'go'],
	githubChecks: ['build'],
	// Transferred from UnstoppableMango/zettelkasten, so the repository already exists.
	repoOptions: { import: 'slip' },
});

export const strata = new PublicRepo('strata', {
	description: 'Nix-first developer environments built from a base template and layered patches',
	topics: ['nix', 'nix-flake', 'developer-environment', 'patches', 'git'],
	githubChecks: ['check'],
});

export const terraform2crd = new PublicRepo('terraform2crd', {
	description: 'Converts Terraform provider code specs to Custom Resource Definitions (CRDs)',
	topics: ['terraform', 'crd', 'kubernetes', 'codegen'],
	githubChecks: [],
	// Moved from gitlab.com/unmango/terraform/2crd, so the repository already exists.
	repoOptions: { import: 'terraform2crd' },
});

// Registry-locked name, do not shorten.
export const terraformProviderAtproto = new PublicRepo('terraform-provider-atproto', {
	description: 'Terraform provider for AT Protocol records, with first-class Tangled support',
	topics: ['terraform', 'opentofu', 'atproto', 'bluesky', 'tangled', 'go'],
	githubChecks: ['build', 'codegen'],
});

// Registry-locked name, do not shorten.
export const terraformProviderNetgear = new PublicRepo('terraform-provider-netgear', {
	description: 'Terraform provider for (some) NetGear devices',
	topics: ['terraform', 'opentofu', 'netgear', 'go'],
	githubChecks: ['build', 'codegen'],
	// Moved from gitlab.com/unmango/terraform/terraform-provider-netgear, so the
	// repository already exists.
	repoOptions: { import: 'terraform-provider-netgear' },
});

export const tfpkgs = new PublicRepo('tfpkgs', {
	description: 'Terraform, providers, and plugins packaged for Nix',
	topics: ['nix', 'nixpkgs', 'nix-flake', 'terraform'],
	githubChecks: ['build'],
});

export const thecluster = new PublicRepo('thecluster', {
	description: 'DevOps tooling for managing a Kubernetes cluster with Pulumi micro-stacks',
	githubChecks: ['Build and Test'],
});

export const theclusterOperator = new PublicRepo('thecluster-operator', {
	description: 'Smörgåsbord of things a person might want running in their Kubernetes cluster',
	githubChecks: ['Build and Test', 'Lint', 'Docker'],
});

export const treespec = new PublicRepo('treespec', {
	description: 'Syntax tree definitions and generated SDKs, built on unist',
	topics: ['unist', 'mdast', 'hast', 'ast', 'protobuf', 'tdl', 'codegen'],
	githubChecks: ['build'],
	// Transferred from UnstoppableMango/gast, so the repository already exists.
	repoOptions: { import: 'treespec' },
});
