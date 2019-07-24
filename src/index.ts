#!/usr/bin/env node

'use strict';

import cp from 'child_process';
import fs from 'fs';
import path from 'path';

import program from 'commander';
import getRemainingArgs from 'commander-remaining-args';
import spawn from 'cross-spawn';
import dotenv from 'dotenv';
import readPkgUp from 'read-pkg-up';
import whichPMRuns from 'which-pm-runs';

type ProcessEnv = NodeJS.ProcessEnv & { NODE_ENV: string };

const getEnv = ({
  env,
  envFile,
}: {
  env: NodeJS.ProcessEnv;
  envFile?: string;
}): ProcessEnv => {
  if (env.NODE_ENV) {
    return { ...env, NODE_ENV: env.NODE_ENV };
  }

  if (envFile) {
    const envPath = path.isAbsolute(envFile)
      ? envFile
      : path.resolve(process.cwd(), envFile);
    const envBuffer = fs.readFileSync(envPath);
    const envConfig = dotenv.parse(envBuffer);

    if (envConfig.NODE_ENV) {
      return { ...env, NODE_ENV: envConfig.NODE_ENV };
    }
  }

  return { ...env, NODE_ENV: 'development' };
};

const getCommand = ({
  env,
  packageManager,
}: {
  env: ProcessEnv;
  packageManager?: string;
}) => {
  if (packageManager) {
    return packageManager;
  }

  if (env.npm_execpath) {
    return env.npm_execpath;
  }

  const pm = whichPMRuns();
  if (pm) {
    return pm.name;
  }

  return 'npm';
};

const getArgs = ({
  env,
  remainingArgs,
  runScript,
}: {
  env: ProcessEnv;
  remainingArgs: string[];
  runScript: string;
}) => ['run', `${runScript}:${env.NODE_ENV}`, ...remainingArgs];

const byNodeEnv = ({
  envFile,
  packageManager,
  remainingArgs = [],
  runScript,
}: {
  envFile?: string;
  packageManager?: string;
  remainingArgs?: string[];
  runScript: string;
}) => {
  const env = getEnv({ env: process.env, envFile });

  const command = getCommand({ env, packageManager });
  const args = getArgs({ env, remainingArgs, runScript });
  const options: cp.SpawnSyncOptions = { env, stdio: 'inherit' };

  spawn.sync(command, args, options);
};

if (require.main === module || !module.parent) {
  program
    .allowUnknownOption()
    .option('-e, --env-file <path>', 'specify path to .env file')
    .option(
      '-p, --package-manager <pm>',
      'specify package manager to run script',
    );

  const packageJson = readPkgUp.sync({ cwd: __dirname });

  if (packageJson) {
    const normalizedPackageJson = packageJson.package;

    if (normalizedPackageJson.description) {
      program.description(normalizedPackageJson.description);
    }

    program.version(normalizedPackageJson.version);
  }

  program.parse(process.argv);

  const { envFile, packageManager } = program;
  const remainingArgs = getRemainingArgs(program);
  const runScript = process.env.npm_lifecycle_event;

  byNodeEnv({ envFile, packageManager, remainingArgs, runScript });
}

export default byNodeEnv;
