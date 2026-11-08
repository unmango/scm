import { output } from '@pulumi/pulumi';
import * as allRepos from './repos';
import './collaborators';
import './seed';

export const giteaRepos = output(Object.values(allRepos).map(x => x.name)).apply(names => [...names].sort());
