import { CustomResourceOptions, dynamic, Input } from '@pulumi/pulumi';
import { createSign } from 'crypto';

/** The policies GitHub offers for running workflows from fork pull requests. */
export type ApprovalPolicy =
	| 'first_time_contributors_new_to_github'
	| 'first_time_contributors'
	| 'all_external_contributors';

export interface ForkPrApprovalArgs {
	repository: Input<string>;
	approvalPolicy: Input<ApprovalPolicy>;
}

interface State {
	repository: string;
	approvalPolicy: ApprovalPolicy;
}

interface AppAuth {
	id: string | number;
	installationId: string | number;
	pemFile: string;
}

interface Auth {
	owner: string;
	app: AppAuth;
}

const api = 'https://api.github.com';
const headers = {
	accept: 'application/vnd.github+json',
	'x-github-api-version': '2022-11-28',
};

function appJwt(app: AppAuth): string {
	const now = Math.floor(Date.now() / 1000);
	const encode = (x: object) => Buffer.from(JSON.stringify(x)).toString('base64url');
	// GitHub rejects an `iat` ahead of its clock.
	const claims = { iat: now - 60, exp: now + 540, iss: String(app.id) };
	const body = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode(claims)}`;
	const signature = createSign('RSA-SHA256').update(body).sign(app.pemFile, 'base64url');
	return `${body}.${signature}`;
}

async function installationToken(app: AppAuth): Promise<string> {
	const response = await fetch(`${api}/app/installations/${String(app.installationId)}/access_tokens`, {
		method: 'POST',
		headers: { ...headers, authorization: `Bearer ${appJwt(app)}` },
	});
	if (!response.ok) throw await failure(response, 'creating an installation token');
	const { token } = await response.json() as { token: string };
	return token;
}

async function approvalRequest(auth: Auth, method: string, repository: string, body?: object): Promise<Response> {
	const token = await installationToken(auth.app);
	return fetch(`${api}/repos/${auth.owner}/${repository}/actions/permissions/fork-pr-contributor-approval`, {
		method,
		headers: { ...headers, authorization: `Bearer ${token}` },
		body: body && JSON.stringify(body),
	});
}

async function failure(response: Response, action: string): Promise<Error> {
	return new Error(`${action}: ${String(response.status)} ${await response.text()}`);
}

// Until the provider has a resource for this: https://togithub.com/integrations/terraform-provider-github/issues/3445
class Provider implements dynamic.ResourceProvider<State, State> {
	private auth?: Auth;

	configure(req: dynamic.ConfigureRequest) {
		const app = JSON.parse(req.config.require('github:appAuth')) as AppAuth;
		this.auth = {
			owner: req.config.require('github:owner'),
			// The github provider accepts a PEM with escaped newlines too.
			app: { ...app, pemFile: app.pemFile.replace(/\\n/g, '\n') },
		};
		return Promise.resolve();
	}

	diff(_id: string, olds: State, news: State) {
		const replaces = olds.repository !== news.repository ? ['repository'] : [];
		return Promise.resolve({
			changes: replaces.length > 0 || olds.approvalPolicy !== news.approvalPolicy,
			replaces,
		});
	}

	async create(inputs: State) {
		await this.put(inputs);
		return { id: inputs.repository, outs: inputs };
	}

	async read(id: string, props?: State) {
		const repository = props?.repository ?? id;
		const response = await approvalRequest(this.requireAuth(), 'GET', repository);
		if (response.status === 404) return {};
		if (!response.ok) throw await failure(response, `reading ${repository}'s fork PR approval`);
		const { approval_policy } = await response.json() as { approval_policy: ApprovalPolicy };
		return { id, props: { repository, approvalPolicy: approval_policy } };
	}

	async update(_id: string, _olds: State, news: State) {
		await this.put(news);
		return { outs: news };
	}

	// GitHub has no unset policy, and the repository may be gone, so deleting
	// only stops managing the setting.
	delete() {
		return Promise.resolve();
	}

	private requireAuth(): Auth {
		if (!this.auth) throw new Error('the ForkPrApproval provider was not configured');
		return this.auth;
	}

	private async put(state: State) {
		const body = { approval_policy: state.approvalPolicy };
		const response = await approvalRequest(this.requireAuth(), 'PUT', state.repository, body);
		if (!response.ok) throw await failure(response, `setting ${state.repository}'s fork PR approval`);
	}
}

/** Which fork pull requests need approval before their workflows run. */
export class ForkPrApproval extends dynamic.Resource {
	constructor(name: string, args: ForkPrApprovalArgs, opts?: CustomResourceOptions) {
		super(new Provider(), name, args, opts, 'github', 'ForkPrApproval');
	}
}
