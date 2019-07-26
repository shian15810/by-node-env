import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

const getNodeEnv = ({
  envFile,
  processEnv,
}: {
  envFile?: string;
  processEnv: NodeJS.ProcessEnv;
}) => {
  if (processEnv.NODE_ENV) {
    return processEnv.NODE_ENV;
  }

  if (envFile) {
    const envPath = path.isAbsolute(envFile)
      ? envFile
      : path.resolve(process.cwd(), envFile);
    const envBuffer = fs.readFileSync(envPath);
    const envConfig = dotenv.parse(envBuffer);

    if (envConfig.NODE_ENV) {
      return envConfig.NODE_ENV;
    }
  }

  return 'development';
};

export type ProcessEnv = NodeJS.ProcessEnv & { NODE_ENV: string };

export const getProcessEnv = ({
  envFile,
  processEnv,
}: {
  envFile?: string;
  processEnv: NodeJS.ProcessEnv;
}): ProcessEnv => {
  const nodeEnv = getNodeEnv({ envFile, processEnv });

  return { ...processEnv, NODE_ENV: nodeEnv };
};

export const getRunScript = ({
  processEnv,
}: {
  processEnv: NodeJS.ProcessEnv;
}) => {
  if (processEnv.npm_lifecycle_event) {
    return processEnv.npm_lifecycle_event;
  }

  return 'start';
};
