#!/usr/bin/env node

import execa from 'execa';

import {
  getPreferredPackageManager,
  getRunningPackageManager,
} from './package-manager';
import { getProcessEnv } from './process-env';
import { getProgram } from './program';
import { getRemainingArgv } from './remaining-argv';
import { getRunScript } from './run-script';

const byNodeEnv = ({
  packageManager,
  processEnv,
  remainingArgv,
  runScript,
}: {
  packageManager: string;
  processEnv: ReturnType<typeof getProcessEnv>;
  remainingArgv: string[];
  runScript: string;
}) => {
  const command = packageManager;
  const args = ['run', `${runScript}:${processEnv.NODE_ENV}`, ...remainingArgv];
  const options: execa.SyncOptions = { env: processEnv, stdio: 'inherit' };

  execa.sync(command, args, options);
};

if (require.main === module || !module.parent) {
  const processArgv = process.argv;
  const processCwd = process.cwd();
  const processEnv = process.env;

  const program = getProgram({ processArgv });
  const { envFile, packageManager } = program;

  byNodeEnv({
    packageManager: getRunningPackageManager({ packageManager, processEnv }),
    processEnv: getProcessEnv({ envFile, processCwd, processEnv }),
    remainingArgv: getRemainingArgv({ program }),
    runScript: getRunScript({ processEnv }),
  });
}

export default ({
  envFile,
  packageManager,
  processCwd = process.cwd(),
  processEnv = process.env,
  remainingArgv,
  runScript,
}: {
  envFile?: string;
  packageManager?: string;
  processCwd?: string;
  processEnv?: NodeJS.ProcessEnv;
  remainingArgv?: string[];
  runScript?: string;
} = {}) => {
  getPreferredPackageManager({ packageManager, processCwd, processEnv }).then(
    (preferredPackageManager) => {
      byNodeEnv({
        packageManager: preferredPackageManager,
        processEnv: getProcessEnv({ envFile, processCwd, processEnv }),
        remainingArgv: getRemainingArgv({ remainingArgv }),
        runScript: getRunScript({ processEnv, runScript }),
      });
    },
  );
};
