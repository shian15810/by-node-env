# by-node-env

Run package.json scripts by `NODE_ENV`.

[![travis build](https://img.shields.io/travis/shian15810/by-node-env.svg)](https://travis-ci.org/shian15810/by-node-env)
[![version](https://img.shields.io/npm/v/by-node-env.svg)](http://npm.im/by-node-env)
[![downloads](https://img.shields.io/npm/dm/by-node-env.svg)](http://npm-stat.com/charts.html?package=by-node-env)
[![MIT License](https://img.shields.io/npm/l/by-node-env.svg)](http://opensource.org/licenses/MIT)

## Installation

Install with npm:

```sh
npm install by-node-env
```

Install with Yarn:

```sh
yarn add by-node-env
```

## Features

- [x] Defaults `NODE_ENV` to `development`.
- [x] Customize `process.env` by-node-environment.
- [x] Clearer, concise scripts.
- [x] No more Bash-scripting in `package.json`.
- [x] Works on Linux, macOS and Windows.
- [x] Compatible with Yarn and npm.
- [x] Simplify your workflow:
  1. `npm install` or `yarn add`.
  2. `npm start` or `yarn start`.

## Example

```js
{
  // Processes spawned by `by-node-env` inherit environment-specific
  // variables, if defined.
  "by-node-env": {
    "production": {
      "DOCKER_USER": "my",
      "DOCKER_REPO": "project"
    }
  },
  "scripts": {
    // If NODE_ENV is missing, defaults to "development".
    "build": "by-node-env",

    "build:development": "webpack -d --watch",
    "build:staging": "webpack -p",
    "build:production": "webpack -p",

    // Deployment won't work unless NODE_ENV=production is explicitly set.
    "deploy": "by-node-env",

    "predeploy:production": "docker build -t ${DOCKER_USER}/${DOCKER_PROJECT} .",
    "deploy:production": "docker push ${DOCKER_USER}/${DOCKER_PROJECT}",

    // "npm start" is _the_ command to start the server across all environments.
    "start": "by-node-env",

    "start:development": "npm run build:development",

    "prestart:production": "npm run build",
    "start:production": "start-cluster build/server/server.js",

    "prestart:staging": "npm run build",
    "start:staging": "start-cluster build/server/server.js",

    // Explicitly set NODE_ENV, which is helpful in CI.
    "test": "NODE_ENV=test by-node-env",

    "test:test": "mocha"
  }
}
```

## Note

`by-node-env` is essentially a clone of [`per-env`](https://www.npmjs.com/package/per-env) with some notable fixes:

- Windows compatibility.
- Yarn compatibility.
