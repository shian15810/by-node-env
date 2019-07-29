export const getRun = ({
  env,
  run,
}: {
  env: NodeJS.ProcessEnv;
  run?: string;
}) => {
  if (run) {
    return run;
  }

  if (env.npm_lifecycle_event) {
    return env.npm_lifecycle_event;
  }

  return 'start';
};
