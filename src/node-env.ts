import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

export const getNodeEnv = ({
  envFile,
  processCwd,
  processEnv,
}: {
  envFile?: string;
  processCwd: string;
  processEnv: NodeJS.ProcessEnv;
}) => {
  if (processEnv.NODE_ENV) {
    return processEnv.NODE_ENV;
  }

  if (envFile) {
    const envPath = path.isAbsolute(envFile)
      ? path.resolve(envFile)
      : path.resolve(processCwd, envFile);
    const envBuffer = fs.readFileSync(envPath);
    const envConfig = dotenv.parse(envBuffer);

    if (envConfig.NODE_ENV) {
      return envConfig.NODE_ENV;
    }
  }

  return 'development';
};
