export const getRunScript = ({
  processEnv,
  runScript,
}: {
  processEnv: NodeJS.ProcessEnv;
  runScript?: string;
}) => {
  if (runScript) {
    return runScript;
  }

  if (processEnv.npm_lifecycle_event) {
    return processEnv.npm_lifecycle_event;
  }

  return 'start';
};
