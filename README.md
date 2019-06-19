# by-node-env

Run **package.json** scripts **by `NODE_ENV`**.

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

- [x] Read `NODE_ENV` as environment variable from `process.env`.
- [x] Read `NODE_ENV` from root **.env** file in project directory.
- [x] Defaults `NODE_ENV` to `development`.
- [x] Customize `process.env` for each `NODE_ENV`.
- [x] Clearer, concise scripts.
- [x] No more Bash-scripting in **package.json**.
- [x] Works on **Linux**, **macOS** and **Windows**.
- [x] Compatible with **npm**, **pnpm** and **Yarn**.
- [x] Simplify workflow:
  1. `npm install` or `pnpm install` or `yarn install`.
  2. `npm start` or `pnpm start` or `yarn start`.

## Problem

Most of the time, no matter if `NODE_ENV` is `development`, `test`, `production` or any other custom value, the only thing that I care about with setting up and running a **Node.js** application is just by simply executing `yarn install` and `yarn start`, which has been the de dacto way of setting up and running a **Node.js** application for many years already anyway.

This can in many ways solve a lot of problems encoutered in setting up countinuous integration and deployment, such as different `yarn run` commands for different values `NODE_ENV`, by exposing a unifying and consistent interface (`yarn install` and `yarn start`), as long as `NODE_ENV` is defined, which in almost all cases should or must be provided as environment variable. When you execute `yarn test`, `NODE_ENV` is implicitly or explicitly set to `test` anyway.

Since setting `NODE_ENV` as environment variable is required and recommended in many ways, why not listing it explicitly in the **scripts** section of **package.json**?

## Solution

### **package.json**

```jsonc
{
  "scripts": {
    "start": "by-node-env",
    "start:development": "node src",
    "start:test": "jest",
    "start:production": "node build",
  }
}
```

These 4 are equivalents:

1. `yarn start` if `NODE_ENV=production` is already defined as enrivonment variable.
2. `export NODE_ENV=production && yarn start`.
3. `NODE_ENV=production yarn start`.
4. `yarn run start:production`.

**4** is different from the rest in term of `NODE_ENV` as this script bypasses **by-node-env**. As a result, the resulting `process.env.NODE_ENV` ended up in your application will not follow the rules of **by-node-env**.

For **1** (`yarn start`), if `NODE_ENV` is not defined as environment variable, `by-node-env` will defaults it to `development` and then run `start:development` script.

## `NODE_ENV`

Priority order of resolving `NODE_ENV` is as follows:

1. Environment variable aka `process.env`.

2. Root **.env** file in project directory.

3. Defaults to `development`.

If `NODE_ENV=development` is listed in root **.env** file and `NODE_ENV=production yarn start` is executed in shell, `yarn run start:production` will be executed by **by-node-env** since environment variable (1) take precedence over root **.env** file (2).

If syntax of `NODE_ENV=production yarn start` is not preferred, just add `NODE_ENV=production` to root **.env** file and execute `yarn start` in shell, **by-node-env** will then execute `yarn run start:production`.

**by-node-env** will not populate `process.env` of your application with entries listed in root **.env** file (except `NODE_ENV`), only purpose of root **.env** file for **by-node-env** is just for it to read an entry called `NODE_ENV` from it.

After `NODE_ENV` is resolved by `by-node-env` and your application is spawned, `NODE_ENV` will be passed to your application as `process.env.NODE_ENV`.

---

## Example 1

### Example 1: **package.json**

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

---

## Example 2

### Example 2: **.env**

```ini
NODE_ENV=production
```

### Example 2: **package.json**

```jsonc
{
  "scripts": {
    // This will run "start:production" since .env file is present and NODE_ENV is defined.
    "start": "by-node-env",

    "start:development": "ts-node .",
    "start:production": "ts-node-dev ."
  }
}
```

---

## Notes

- **by-node-env** is essentially a clone of [**per-env**](https://www.npmjs.com/package/per-env) with some notable fixes:

  - **.env** (`NODE_ENV` only) compatibility.
  - **pnpm** compatibility.
  - **Windows** compatibility.
  - **Yarn** compatibility.

- Root **.env** file in project directory is parsed using [**dotenv**](https://www.npmjs.com/package/dotenv).

- Option to specify custom file path for **.env** file is not yet implemented, please raise an issue or PR if needed.

## Contributing

Encounter bugs or having new suggestions?

Issues, comments and PRs are always welcomed!
