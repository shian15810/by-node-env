import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

export const getNodeEnv = ({
  cwd,
  env,
  envFile,
}: {
  cwd: string;
  env: NodeJS.ProcessEnv;
  envFile?: string;
}) => {
  if (env.NODE_ENV) {
    return env.NODE_ENV;
  }

  if (envFile) {
    const envPath = path.isAbsolute(envFile)
      ? path.resolve(envFile)
      : path.resolve(cwd, envFile);
    const envBuffer = fs.readFileSync(envPath);
    const envConfig = dotenv.parse(envBuffer);

    if (envConfig.NODE_ENV) {
      return envConfig.NODE_ENV;
    }
  }

  return 'development';
};
