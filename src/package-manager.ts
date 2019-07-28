import preferredPM from 'preferred-pm';
import whichPMRuns from 'which-pm-runs';

import { getPackageJson } from './package-json';

const getPackageManagerFromPackageJson = ({
  processCwd,
}: {
  processCwd: string;
}) => {
  const packageJson = getPackageJson({ processCwd });

  if (packageJson && packageJson.engines) {
    const { node, ...engines } = packageJson.engines;
    const packageManagers = Object.keys(engines).filter(
      (packageManager) => packageManager,
    );

    if (packageManagers.length >= 1) {
      return packageManagers[0];
    }
  }
};

const getPackageManagerFromProcessEnv = ({
  processEnv,
}: {
  processEnv: NodeJS.ProcessEnv;
}) => {
  if (processEnv.npm_execpath) {
    return processEnv.npm_execpath;
  }

  const pm = whichPMRuns();

  if (pm) {
    return pm.name;
  }
};

export const getPreferredPackageManager = async ({
  packageManager,
  processCwd,
  processEnv,
}: {
  packageManager?: string;
  processCwd: string;
  processEnv: NodeJS.ProcessEnv;
}) => {
  if (packageManager) {
    return packageManager;
  }

  const packageManagerFromProcessEnv = getPackageManagerFromProcessEnv({
    processEnv,
  });

  if (packageManagerFromProcessEnv) {
    return packageManagerFromProcessEnv;
  }

  const pm = await preferredPM(processCwd);

  if (pm) {
    return pm.name;
  }

  const packageManagerFromPackageJson = getPackageManagerFromPackageJson({
    processCwd,
  });

  if (packageManagerFromPackageJson) {
    return packageManagerFromPackageJson;
  }

  return 'npm';
};

export const getRunningPackageManager = ({
  packageManager,
  processEnv,
}: {
  packageManager?: string;
  processEnv: NodeJS.ProcessEnv;
}) => {
  if (packageManager) {
    return packageManager;
  }

  const packageManagerFromProcessEnv = getPackageManagerFromProcessEnv({
    processEnv,
  });

  if (packageManagerFromProcessEnv) {
    return packageManagerFromProcessEnv;
  }

  return 'npm';
};
