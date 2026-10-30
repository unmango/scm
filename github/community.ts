import * as gh from '@pulumi/github';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { dotGithub } from './repos';

// The files are edited here, under github/community, and reviewed in this repo's
// pull requests; each one is committed to the root of unmango/.github.
const files = ['AI_POLICY.md', 'CONTRIBUTING.md', 'pull_request_template.md'];

for (const file of files) {
	new gh.RepositoryFile(`dotgithub-${file}`, {
		repository: dotGithub.repo.name,
		branch: 'main',
		file,
		content: readFileSync(join(__dirname, 'community', file), 'utf8'),
		commitMessage: `docs: update ${file} from unmango/scm`,
		overwriteOnCreate: true,
	}, { parent: dotGithub, dependsOn: [dotGithub.mainRuleset] });
}
