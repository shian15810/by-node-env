'use strict';

var assert = require('assert').strict;
var pkg = require('./package.json');

var env =
  (pkg && pkg['by-node-env'] && pkg['by-node-env'][process.env.NODE_ENV]) || {};

Object.keys(env).forEach((key) => {
  assert.strictEqual(process.env[key], env[key]);
});
