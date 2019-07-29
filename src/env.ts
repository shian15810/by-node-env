import { getNodeEnv } from './node-env';

export const getEnv = ({
  cwd,
  env,
  envFile,
}: {
  cwd: string;
  env: NodeJS.ProcessEnv;
  envFile?: string;
}): NodeJS.ProcessEnv & { NODE_ENV: string } => {
  const nodeEnv = getNodeEnv({ cwd, env, envFile });

  return { ...env, NODE_ENV: nodeEnv };
};
