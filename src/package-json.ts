import readPkgUp from 'read-pkg-up';

export const getPackageJson = ({ cwd }: { cwd: string }) => {
  const packageJson = readPkgUp.sync({ cwd });

  if (packageJson) {
    return packageJson.package;
  }

  return undefined;
};
