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
2. **.env** file in project root directory.
3. `development` (default).

The **.env** file, if present, must be located in the root directory of your project, where **package.json** lie.

The resolved `NODE_ENV` is available as `process.env.NODE_ENV` in your application at runtime.

## Examples

### Example 1a

#### Example 1a: package.json

```jsonc
{
  "scripts": {
    "start": "by-node-env",                 // 1

    "start:development": "ts-node src",     // 2a
    "start:production": "ts-node-dev src"   // 2b
  }
}
```

1. `npm start`: **1** :arrow_right: **2a**
2. `NODE_ENV=development npm start`: **1** :arrow_right: **2a**
3. `NODE_ENV=production npm start`: **1** :arrow_right: **2b**

### Example 1b

#### Example 1b: .env

```ini
NODE_ENV=production
```

#### Example 1b: package.json

```jsonc
{
  "scripts": {
    "start": "by-node-env",                 // 1

    "start:development": "ts-node src",     // 2a
    "start:production": "ts-node-dev src"   // 2b
  }
}
```

1. `npm start`: **1** :arrow_right: **2b**
2. `NODE_ENV=development npm start`: **1** :arrow_right: **2a**
3. `NODE_ENV=production npm start`: **1** :arrow_right: **2b**

### Example 2

#### Example 2: package.json

```jsonc
{
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

## Contributing

Encounter bugs or having new suggestions?

Issues, comments, and PRs are always welcomed!
