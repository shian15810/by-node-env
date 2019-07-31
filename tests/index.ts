import { strict as assert } from 'assert';

import nopt from 'nopt';

const {
  NODE_ENV,
  npm_config_argv = '',
  npm_lifecycle_event = '',
} = process.env;

const configArgv: ReturnType<typeof nopt>['argv'] = JSON.parse(npm_config_argv);
const [runScript] = configArgv.original.slice(-1);

const lifecycleHooks = ['pre', '', 'post'];

if (NODE_ENV && runScript.endsWith(`:${NODE_ENV}`)) {
  const [runScriptEvent, runScriptNodeEnv] = runScript.split(':');

  assert.ok(npm_lifecycle_event.endsWith(runScript));
  assert.equal(runScriptNodeEnv, NODE_ENV);

  const [lifecycleEvent, lifecycleNodeEnv] = npm_lifecycle_event.split(':');
  const lifecycleHook = lifecycleEvent.slice(
    0,
    lifecycleEvent.length - runScriptEvent.length,
  );
  const lifecycleScript = lifecycleEvent.slice(-runScriptEvent.length);

  assert.ok(lifecycleHooks.includes(lifecycleHook));
  assert.equal(lifecycleScript, runScriptEvent);
  assert.equal(lifecycleNodeEnv, NODE_ENV);
} else {
  const runScriptEvent = runScript;

  const [lifecycleEvent, lifecycleNodeEnv] = npm_lifecycle_event.split(':');
  const lifecycleHook = lifecycleEvent.slice(
    0,
    lifecycleEvent.length - runScriptEvent.length,
  );
  const lifecycleScript = lifecycleEvent.slice(-runScriptEvent.length);

  assert.ok(lifecycleHooks.includes(lifecycleHook));
  assert.equal(lifecycleScript, runScriptEvent);
  assert.equal(lifecycleNodeEnv, NODE_ENV);
}
