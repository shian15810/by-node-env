# runenv

Run package.json scripts depending on `NODE_ENV`.

[![travis build](https://img.shields.io/travis/shian15810/runenv.svg)](https://travis-ci.org/shian15810/runenv)
[![version](https://img.shields.io/npm/v/runenv.svg)](http://npm.im/runenv)
[![downloads](https://img.shields.io/npm/dm/runenv.svg)](http://npm-stat.com/charts.html?package=runenv)
[![MIT License](https://img.shields.io/npm/l/runenv.svg)](http://opensource.org/licenses/MIT)

## Installation

Install with npm:

```sh
npm install runenv
```

Install with Yarn:

```sh
yarn add runenv
```

## Features

- [x] Defaults `NODE_ENV` to `development`.
- [x] Customize `process.env` runenvironment.
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
  // Processes spawned by `runenv` inherit environment-specific
  // variables, if defined.
  "runenv": {
    "production": {
      "DOCKER_USER": "my",
      "DOCKER_REPO": "project"
    }
  },
  "scripts": {
    // If NODE_ENV is missing, defaults to "development".
    "build": "runenv",

    "build:development": "webpack -d --watch",
    "build:staging": "webpack -p",
    "build:production": "webpack -p",

    // Deployment won't work unless NODE_ENV=production is explicitly set.
    "deploy": "runenv",

    "predeploy:production": "docker build -t ${DOCKER_USER}/${DOCKER_PROJECT} .",
    "deploy:production": "docker push ${DOCKER_USER}/${DOCKER_PROJECT}",

    // "npm start" is _the_ command to start the server across all environments.
    "start": "runenv",

    "start:development": "npm run build:development",

    "prestart:production": "npm run build",
    "start:production": "start-cluster build/server/server.js",

    "prestart:staging": "npm run build",
    "start:staging": "start-cluster build/server/server.js",

    // Explicitly set NODE_ENV, which is helpful in CI.
    "test": "NODE_ENV=test runenv",

    "test:test": "mocha"
  }
}
```

## Note

`runenv` is essentially a clone of [`per-env`](https://www.npmjs.com/package/per-env) with some notable fixes in 1.0.0:

- Windows compatibility.
- Yarn compatibility.
