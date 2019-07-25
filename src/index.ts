#!/usr/bin/env node

'use strict';

import cp from 'child_process';

import program from 'commander';
import getRemainingArgs from 'commander-remaining-args';
import spawn from 'cross-spawn';
import readPkgUp from 'read-pkg-up';

import {
  getPreferredPackageManager,
  getRunningPackageManager,
} from './package-manager';
import { getProcessEnv, getRunScript, ProcessEnv } from './env';

const byNodeEnv = ({
  packageManager,
  processEnv,
  remainingArgs,
  runScript,
}: {
  packageManager: string;
  processEnv: ProcessEnv;
  remainingArgs: string[];
  runScript: string;
}) => {
  const command = packageManager;
  const args = ['run', `${runScript}:${processEnv.NODE_ENV}`, ...remainingArgs];
  const options: cp.SpawnSyncOptions = { env: processEnv, stdio: 'inherit' };

  spawn.sync(command, args, options);
};

if (require.main === module || !module.parent) {
  const processCwd = __dirname;
  const processEnv = process.env;

  program
    .allowUnknownOption()
    .option('-e, --env-file <path>', 'specify path to .env file')
    .option(
      '-p, --package-manager <pm>',
      'specify package manager to run script',
    );

  const packageJson = readPkgUp.sync({ cwd: processCwd });

  if (packageJson) {
    const normalizedPackageJson = packageJson.package;

    if (normalizedPackageJson.description) {
      program.description(normalizedPackageJson.description);
    }

    program.version(normalizedPackageJson.version);
  }

  program.parse(process.argv);

  const { envFile, packageManager } = program;

  byNodeEnv({
    packageManager: getRunningPackageManager({ packageManager, processEnv }),
    processEnv: getProcessEnv({ envFile, processEnv }),
    remainingArgs: getRemainingArgs(program),
    runScript: getRunScript({ processEnv }),
  });
}

export default ({
  envFile,
  packageManager,
  processCwd = process.cwd(),
  processEnv = process.env,
  remainingArgs = [],
  runScript = 'start',
}: {
  envFile?: string;
  packageManager?: string;
  processCwd?: string;
  processEnv?: NodeJS.ProcessEnv;
  remainingArgs?: string[];
  runScript?: string;
} = {}) => {
  getPreferredPackageManager({
    packageManager: getRunningPackageManager({ packageManager, processEnv }),
    processCwd,
  }).then((preferredPackageManager) => {
    byNodeEnv({
      packageManager: preferredPackageManager,
      processEnv: getProcessEnv({ envFile, processEnv }),
      remainingArgs,
      runScript,
    });
  });
};
