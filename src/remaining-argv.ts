import { CommanderStatic } from 'commander';
import getRemainingArgs from 'commander-remaining-args';

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
    return getRemainingArgs(program);
  }

  return [];
};
