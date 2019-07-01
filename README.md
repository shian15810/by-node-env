# by-node-env

Run **package.json** **scripts** by `NODE_ENV`.

[![Travis (.com)](https://img.shields.io/travis/com/shian15810/by-node-env.svg)](https://travis-ci.com/shian15810/by-node-env)
[![npm](https://img.shields.io/npm/v/by-node-env.svg)](https://www.npmjs.com/package/by-node-env)
[![npm](https://img.shields.io/npm/dw/by-node-env.svg)](https://npm-stat.com/charts.html?package=by-node-env)
[![NPM](https://img.shields.io/npm/l/by-node-env.svg)](https://choosealicense.com/licenses/mit/)

## Installation

Install with **npm**:

```sh
npm install by-node-env
```

Install with **pnpm**:

```sh
pnpm install by-node-env
```

Install with **Yarn**:

```sh
yarn add by-node-env
```

## Features

- [x] Read `NODE_ENV` from `process.env`.
- [x] Read `NODE_ENV` from **.env** file.
- [x] Defaults `NODE_ENV` to `development`.
- [x] Customize `process.env` for each `NODE_ENV`.
- [x] Clearer, concise **scripts** in **package.json**.
- [x] No more **Bash** scripting in **package.json**.
- [x] Works on **Linux**, **macOS**, and **Windows**.
- [x] Compatible with **npm**, **pnpm**, and **Yarn**.
- [x] Consistent workflow for any `NODE_ENV`:
  1. `npm install` or `pnpm install` or `yarn install`.
  2. `npm start` or `pnpm start` or `yarn start`.

## Problem

When developing a **Node.js** application in `development` mode, we often use these different commands: `npm run serve`, `npm run watch`, `npm run dev`, etc. In addition, we also set `NODE_ENV=development` as an environment variable.

When deploying to `production`, we often use these different commands: `npm start`, `npm build`, `npm run prod`, etc. `NODE_ENV=production` is a must-have environment variable in this case.

The **package.json** might look like this for those situations mentioned above:

```json
{
  "scripts": {
    "watch": "webpack -d --watch",
    "build": "webpack -p",

    "dev": "nodemon src",
    "prod": "node dist",

    "serve": "npm run watch & npm run dev",
    "start": "npm build && npm run prod"
  }
}
```

Working on multiple projects with different commands can be very confusing and forgetting, especially under heavy cognitive load. As a result, we spend a lot of time consulting the **README** or the **scripts** field in **package.json**.

## Solution

### package.json

```json
{
  "scripts": {
    "build": "by-node-env",

    "build:development": "webpack -d --watch",
    "build:production": "webpack -p",

    "start": "by-node-env",

    "start:development": "npm build & nodemon src",
    "start:production": "npm build && node dist"
  }
}
```

`npm build` and `npm start` have long been the de facto commands to *build* and *start* a **Node.js** application, respectively.

Besides that, `NODE_ENV` should always be explicitly set as an environment variable for best practice. A lot of popular frameworks expect `NODE_ENV` to be set as well.

Why not combine both, so that when `NODE_ENV=production`, executing `npm start` will spawn `npm run start:production`. Similarly, when `NODE_ENV=development`, executing `npm start` will spawn `npm run start:development`.

Arbitrary `NODE_ENV` and **scripts** work too, refer to more examples below.

## NODE_ENV

The priority order of resolving `NODE_ENV` is as follows:

1. Environment variable.
2. **.env** file.
3. `development` (default).

The resolved `NODE_ENV` is available as `process.env.NODE_ENV` in your application at runtime.

## Pre and Post Scripts

Given a **package.json** with *pre* and *post* **scripts** as shown below:

```jsonc
{
  "scripts": {
    "prestart": "echo prestart",                              // 1

    "start": "by-node-env",                                   // 2

    "prestart:development": "echo prestart:development",      // 3a
    "start:development": "echo start:development",            // 4a
    "poststart:development": "echo poststart:development",    // 5a

    "prestart:production": "echo prestart:production",        // 3b
    "start:production": "echo start:production",              // 4b
    "poststart:production": "echo poststart:production",      // 5b

    "poststart": "echo poststart"                             // 6
  }
}
```

Executing `NODE_ENV=development npm start` will trigger: `1` :arrow_right: `2` :arrow_right: `3a` :arrow_right: `4a` :arrow_right: `5a` :arrow_right: `6`.

Executing `NODE_ENV=production npm start` will trigger: `1` :arrow_right: `2` :arrow_right: `3b` :arrow_right: `4b` :arrow_right: `5b` :arrow_right: `6`.

## Examples

### Example 1

#### Example 1: .env

```ini
NODE_ENV=production
```

#### Example 1: package.json

```jsonc
{
  "scripts": {
    // This will run "start:production" since .env file is present and NODE_ENV is defined in it.
    "start": "by-node-env",

    "start:development": "ts-node src",
    "start:production": "ts-node-dev src"
  }
}
```

### Example 2

#### Example 2: package.json

```jsonc
{
  // Processes spawned by by-node-env inherit environment-specific variables, if defined.
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
    "build:production": "webpack -p",
    "build:staging": "webpack -p",

    // Deployment will not work unless NODE_ENV=production is explicitly set.
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

## Notes

- **by-node-env** is essentially a clone of [**per-env**](https://www.npmjs.com/package/per-env) with some notable fixes:

  - **.env** (`NODE_ENV` only) support.
  - **pnpm** compatibility.
  - **Windows** compatibility.
  - **Yarn** compatibility.

- The **.env** file is parsed using [**dotenv**](https://www.npmjs.com/package/dotenv).

- This package might support more **.env** files in the future, as documented by **create-react-app** [here](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#what-other-env-files-can-be-used).

- Option to specify a custom file path for the **.env** file is not yet implemented, please raise an issue or PR if you need this feature.

## Contributing

Encounter bugs or having new suggestions?

Issues, comments, and PRs are always welcomed!
