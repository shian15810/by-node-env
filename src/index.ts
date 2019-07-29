#!/usr/bin/env node

import execa from 'execa';

import {
  getPreferredPackageManager,
  getRunningPackageManager,
} from './package-manager';
import { getEnv } from './env';
import { getProgram } from './program';
import { getArgs } from './args';
import { getRun } from './run';

const byNodeEnv = ({
  args,
  env,
  packageManager,
  run,
}: {
  args: string[];
  env: ReturnType<typeof getEnv>;
  packageManager: string;
  run: string;
}) => {
  const command = packageManager;
  const args = ['run', `${run}:${env.NODE_ENV}`, ...args];
  const options: execa.SyncOptions = { env, stdio: 'inherit' };

  execa.sync(command, args, options);
};

if (require.main === module || !module.parent) {
  const argv = process.argv;
  const cwd = process.cwd();
  const env = process.env;

  const program = getProgram({ argv });
  const { envFile, packageManager } = program;

  byNodeEnv({
    args: getArgs({ program }),
    env: getEnv({ cwd, env, envFile }),
    packageManager: getRunningPackageManager({ env, packageManager }),
    run: getRun({ env }),
  });
}

export default ({
  args,
  cwd = process.cwd(),
  env = process.env,
  envFile,
  packageManager,
  run,
}: {
  envFile?: string;
  packageManager?: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  args?: string[];
  run?: string;
} = {}) => {
  getPreferredPackageManager({ cwd, env, packageManager }).then(
    (preferredPackageManager) => {
      byNodeEnv({
        args: getArgs({ args }),
        env: getEnv({ cwd, env, envFile }),
        packageManager: preferredPackageManager,
        run: getRun({ env, run }),
      });
    },
  );
};
