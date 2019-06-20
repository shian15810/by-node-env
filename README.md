# by-node-env

> Run package.json scripts determined by NODE_ENV.

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
- [x] Read `NODE_ENV` from **.env** file in project root directory.
- [x] Defaults `NODE_ENV` to `development`.
- [x] Customize `process.env` for each `NODE_ENV`.
- [x] Clearer, concise **scripts** in **package.json**.
- [x] No more **Bash** scripting in **package.json**.
- [x] Works on **Linux**, **macOS** and **Windows**.
- [x] Compatible with **npm**, **pnpm** and **Yarn**.
- [x] Consistent workflow for any `NODE_ENV`:
  1. `npm install` or `pnpm install` or `yarn install`.
  2. `npm start` or `pnpm start` or `yarn start`.

## Problem

When developing a **Node.js** application in `development` mode, we often start our application with one of these different commands: `npm start`, `npm run dev`, `npm run serve`, etc. In addition, we also explicitly set `NODE_ENV=development` as an environment variable for our application to work as expected in `development` mode.

When deploying to `production`, we often use one of these different commands: `npm start`, `npm run prod`, `npm run serve`, etc. `NODE_ENV=production` is a must-have environment variable in this situation.

When dealing with a lot of projects at the same time, it can get really troubling and embarassing, especially under heavy cognitive load. As a result, we often ended up wasting time consulting **README** or **scripts** in **package.json** to figure it out.

For setup files of CI and CD such as **.travis.yml** and **docker-compose.yml**, differing command to start our application in certain mode is also very confusing. This also make understanding those setup files a little bit harder.

## Solution

### **package.json**

```jsonc
{
  "scripts": {
    // Listing all start scripts by NODE_ENV like this is way more concise and explicit.
    "start": "by-node-env",

    "start:development": "node src",
    "start:test": "npm test",
    "start:production": "node build",
  }
}
```

`npm start` has been the de facto way of starting a **Node.js** application for a very long time.

Besides that, to ensure that our application start in the mode we desired so that it works as expected in that mode, `NODE_ENV` is often set as an environment variable.

Why not combining both, so that when we execute `npm start` when `NODE_ENV=production`, `npm run start:production` will be spawned.

Similarly, executing `npm start` when `NODE_ENV=development` will spawn `npm run start:development`.

Even when `NODE_ENV=test`, `npm start` can be set to spawn `npm run start:test` too. Some might disagree with this and would instead go for `npm test`. However, you could set `"start:test": "npm test"` as shown above, so that when you execute `npm start` when `NODE_ENV=test`, `npm test` will eventually get spawned.

Custom **scripts** other than **start** can also be provided in **package.json**. The same applies to custom `NODE_ENV` too. Refer to more examples below.

In short, `NODE_ENV` acts as a switch for which **scripts** in **package.json** to be selected for execution, which is the purpose of **by-node-env**.

## `NODE_ENV`

**by-node-env** needs to resolve `NODE_ENV` ahead of running your application to select appropriate **scripts** in **package.json** for execution, at the same time set the resolved `NODE_ENV` as `process.env.NODE_ENV` for you in your application.

Priority order of resolving `NODE_ENV` is as follows:

1. Environment variable.

2. **.env** file in project root directory.

3. Defaults to `development`.

Whichever `NODE_ENV` found first takes precedence.

**by-node-env** will only set `process.env.NODE_ENV` of your application to `NODE_ENV` it resolved. Other environment variables will be passed as is to your application in `process.env`. If a **.env** file is present in your project root directory, all entries except `NODE_ENV` are ignored.

In other words, **by-node-env** will not mess with your environment variables except `NODE_ENV`.

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

- **.env** file in project root directory is parsed using [**dotenv**](https://www.npmjs.com/package/dotenv).

- This package might support more **.env** files as documented by **create-react-app** [here](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#what-other-env-files-can-be-used) in the future.

- Option to specify custom file path for **.env** file is not yet implemented, please raise an issue or PR if you need this feature.

## Contributing

Encounter bugs or having new suggestions?

Issues, comments and PRs are always welcomed!
