import { CommanderStatic } from 'commander';
import getRemainingArgs from 'commander-remaining-args';

export const getArgs = ({
  args,
  program,
}: {
  args?: string[];
  program?: CommanderStatic;
}) => {
  if (args) {
    return args;
  }

  if (program) {
    return getRemainingArgs(program);
  }

  return [];
};
