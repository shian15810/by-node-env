import readPkgUp from 'read-pkg-up';

export const getPackageJson = ({ processCwd }: { processCwd: string }) => {
  const packageJson = readPkgUp.sync({ cwd: processCwd });

  if (packageJson) {
    return packageJson.package;
  }

  return undefined;
};
