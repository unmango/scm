import { output } from '@pulumi/pulumi';
import * as allRepos from './repos';

export const giteaRepos = output(Object.values(allRepos).map(x => x.name)).apply(names => [...names].sort());
