'use strict';

var assert = require('assert').strict;

assert.strictEqual(
  process.env.npm_lifecycle_event.split(':')[1],
  process.env.NODE_ENV,
);
