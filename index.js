#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('cross-spawn');
var dotenv = require('dotenv');
var whichPMRuns = require('which-pm-runs');
var pkg = require(path.resolve(process.cwd(), 'package.json'));

var envPath = path.resolve(process.cwd(), '.env');
// Default to "development"
var nodeEnv = 'development';
if (fs.existsSync(envPath)) {
  var envConfig = dotenv.parse(fs.readFileSync(envPath));
  if (envConfig && envConfig.NODE_ENV) {
    nodeEnv = envConfig.NODE_ENV;
  }
}
var NODE_ENV = process.env.NODE_ENV || nodeEnv;

var env = Object.assign(
  {},
  // Override with package.json custom env variables
  (pkg && pkg['by-node-env'] && pkg['by-node-env'][NODE_ENV]) || {},
  // Default NODE_ENV
  { NODE_ENV: NODE_ENV },
  // Explicit env takes precedence
  process.env,
);

if (require.main === module || !module.parent) {
  var pm = whichPMRuns();
  var command = pm && pm.name ? pm.name : env.npm_execpath || 'npm';

  var script = [
    env.npm_lifecycle_event || 'start', // e.g. "start"
    env.NODE_ENV,
  ].join(':'); // e.g. "start:development"

  var args = ['run', script].concat(
    // Extra arguments after "by-node-env"
    process.argv.slice(2),
  );

  var options = {
    cwd: process.cwd(),
    env: env,
    stdio: 'inherit',
  };

  var result = spawn.sync(command, args, options);

  process.exit(result.status);
} else {
  Object.assign(process.env, env);
}
