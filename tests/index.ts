import { strict as assert } from 'assert';

import nopt from 'nopt';

const {
  NODE_ENV,
  npm_config_argv = '',
  npm_lifecycle_event = '',
} = process.env;

const configArgv: ReturnType<typeof nopt>['argv'] = JSON.parse(npm_config_argv);
const runScript = configArgv.original.slice(-1)[0];

const [lifecycleEvent, nodeEnv] = npm_lifecycle_event.split(':');
const lifecycleScript = lifecycleEvent.slice(-runScript.length);

assert.equal(runScript, lifecycleScript);

assert.equal(NODE_ENV, nodeEnv);
