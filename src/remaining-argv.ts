import { CommanderStatic } from 'commander';
import getUnknownArgs from 'commander-remaining-args';

export const getRemainingArgv = ({
  program,
  remainingArgv,
}: {
  program?: CommanderStatic;
  remainingArgv?: string[];
}) => {
  if (remainingArgv) {
    return remainingArgv;
  }

  if (program) {
    return getUnknownArgs(program);
  }

  return [];
};
