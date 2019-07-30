#!/usr/bin/env node
/// <reference types="node" />
import execa from 'execa';
declare const _default: ({ envFile, packageManager, processCwd, processEnv, remainingArgv, runScript, }?: {
    envFile?: string | undefined;
    packageManager?: string | undefined;
    processCwd?: string | undefined;
    processEnv?: NodeJS.ProcessEnv | undefined;
    remainingArgv?: string[] | undefined;
    runScript?: string | undefined;
}) => Promise<execa.ExecaSyncReturnValue<string>>;
export default _default;
//# sourceMappingURL=index.d.ts.map