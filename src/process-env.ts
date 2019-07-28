import { getNodeEnv } from './node-env';

export type ProcessEnv = NodeJS.ProcessEnv & { NODE_ENV: string };

export const getProcessEnv = ({
  envFile,
  processCwd,
  processEnv,
}: {
  envFile?: string;
  processCwd: string;
  processEnv: NodeJS.ProcessEnv;
}): ProcessEnv => {
  const nodeEnv = getNodeEnv({ envFile, processCwd, processEnv });

  return { ...processEnv, NODE_ENV: nodeEnv };
};
