import program from 'commander';
import readPkgUp from 'read-pkg-up';

program
  .allowUnknownOption()
  .option('-e, --env-file <path>', 'specify path to .env file')
  .option(
    '-p, --package-manager <pm>',
    'specify package manager to run script',
  );

const packageJson = readPkgUp.sync({ cwd: __dirname });

if (packageJson) {
  const normalizedPackageJson = packageJson.package;

  if (normalizedPackageJson.description) {
    program.description(normalizedPackageJson.description);
  }

  program.version(normalizedPackageJson.version);
}

program.parse(process.argv);

export default program;
