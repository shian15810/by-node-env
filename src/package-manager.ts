import preferredPM from 'preferred-pm';
import whichPMRuns from 'which-pm-runs';

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

  if (processEnv.npm_execpath) {
    return processEnv.npm_execpath;
  }

  const pm = whichPMRuns();

  if (pm) {
    return pm.name;
  }

  return 'npm';
};

export const getPreferredPackageManager = async ({
  packageManager,
  processCwd,
}: {
  packageManager?: string;
  processCwd: string;
}) => {
  if (packageManager) {
    return packageManager;
  }

  const pm = await preferredPM(processCwd);

  if (pm) {
    return pm.name;
  }

  return 'npm';
};
