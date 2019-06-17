# by-node-env

Run **package.json** scripts by `NODE_ENV`.

[![Travis (.com)](https://img.shields.io/travis/com/shian15810/by-node-env.svg)](https://travis-ci.com/shian15810/by-node-env)
[![npm](https://img.shields.io/npm/v/by-node-env.svg)](https://www.npmjs.com/package/by-node-env)
[![npm](https://img.shields.io/npm/dw/by-node-env.svg)](https://npm-stat.com/charts.html?package=by-node-env)
[![NPM](https://img.shields.io/npm/l/by-node-env.svg)](https://choosealicense.com/licenses/mit/)

## Installation

Install with npm:

```sh
npm install by-node-env
```

Install with pnpm:

```sh
pnpm install by-node-env
```

Install with Yarn:

```sh
yarn add by-node-env
```

## Features

- [x] Defaults `NODE_ENV` to `development`.
- [x] Customize `process.env` for each `NODE_ENV`.
- [x] Clearer, concise scripts.
- [x] No more Bash-scripting in **package.json**.
- [x] Works on Linux, macOS and Windows.
- [x] Compatible with npm, pnpm and Yarn.
- [x] Simplify your workflow:
  1. `npm install` or `pnpm install` or `yarn add`.
  2. `npm start` or `pnpm start` or `yarn start`.

## Example

```js
{
  // Processes spawned by by-node-env inherit environment-specific
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

**by-node-env** is essentially a clone of [**per-env**](https://www.npmjs.com/package/per-env) with some notable fixes:

- pnpm compatibility.
- Windows compatibility.
- Yarn compatibility.

## Contributing

Do you encounter bugs or having new ideas?

Issues, comments and PRs are always welcomed!
