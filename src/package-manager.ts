import preferredPM from 'preferred-pm';
import whichPMRuns from 'which-pm-runs';

import { getPackageJson } from './package-json';

const getPackageManagerFromPackageJson = ({ cwd }: { cwd: string }) => {
  const packageJson = getPackageJson({ cwd });

  if (packageJson && packageJson.engines) {
    const { node, ...engines } = packageJson.engines;
    const packageManagers = Object.keys(engines).filter(
      (packageManager) => packageManager,
    );

    if (packageManagers.length >= 1) {
      return packageManagers[0];
    }
  }

  return undefined;
};

const getPackageManagerFromProcessEnv = ({
  env,
}: {
  env: NodeJS.ProcessEnv;
}) => {
  if (env.npm_execpath) {
    return env.npm_execpath;
  }

  const pm = whichPMRuns();

  if (pm) {
    return pm.name;
  }

  return undefined;
};

export const getPreferredPackageManager = async ({
  cwd,
  env,
  packageManager,
}: {
  cwd: string;
  env: NodeJS.ProcessEnv;
  packageManager?: string;
}) => {
  if (packageManager) {
    return packageManager;
  }

  const packageManagerFromProcessEnv = getPackageManagerFromProcessEnv({
    env,
  });

  if (packageManagerFromProcessEnv) {
    return packageManagerFromProcessEnv;
  }

  const pm = await preferredPM(cwd);

  if (pm) {
    return pm.name;
  }

  const packageManagerFromPackageJson = getPackageManagerFromPackageJson({
    cwd,
  });

  if (packageManagerFromPackageJson) {
    return packageManagerFromPackageJson;
  }

  return 'npm';
};

export const getRunningPackageManager = ({
  env,
  packageManager,
}: {
  env: NodeJS.ProcessEnv;
  packageManager?: string;
}) => {
  if (packageManager) {
    return packageManager;
  }

  const packageManagerFromProcessEnv = getPackageManagerFromProcessEnv({
    env,
  });

  if (packageManagerFromProcessEnv) {
    return packageManagerFromProcessEnv;
  }

  return 'npm';
};
