import { getNodeEnv } from './node-env';

export const getProcessEnv = ({
  envFile,
  processCwd,
  processEnv,
}: {
  envFile?: string;
  processCwd: string;
  processEnv: NodeJS.ProcessEnv;
}): NodeJS.ProcessEnv & { NODE_ENV: string } => {
  const nodeEnv = getNodeEnv({ envFile, processCwd, processEnv });

  return { ...processEnv, NODE_ENV: nodeEnv };
};
