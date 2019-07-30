import getUnknownArgs from 'commander-remaining-args';

import { getProgram } from './program';

export const getRemainingArgv = ({
  program,
  remainingArgv,
}: {
  program?: ReturnType<typeof getProgram>;
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
