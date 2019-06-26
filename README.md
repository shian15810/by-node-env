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

- [x] Read `NODE_ENV` as environment variable from `process.env`.
- [x] Read `NODE_ENV` from **.env** file in your project root directory.
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

When developing a **Node.js** application in `development` mode, we often start our application with one of these different commands: `npm start`, `npm run dev`, `npm run serve`, etc. In addition, we also explicitly set `NODE_ENV=development` as an environment variable for our application to work as expected.

When deploying to `production`, we often use one of these different commands: `npm start`, `npm run prod`, `npm run serve`, etc. `NODE_ENV=production` is a must-have environment variable in this situation.

The **package.json** might look like this for the situations mentioned above:

```jsonc
{
  "scripts": {
    // Different scripts for each NODE_ENV.
    "dev": "NODE_ENV=development node src",
    "prod": "NODE_ENV=production node build",

    "serve": "npm run dev",
    "start": "npm run prod",

    "test": "jest"
  }
}
```

When simultaneously working on multiple projects each with a different startup command, it could be very troubling and forgetting, especially under heavy cognitive load. As a result, we often waste our precious time consulting the **README** or the **scripts** field in **package.json**.

## Solution

### package.json

```jsonc
{
  "scripts": {
    "start": "by-node-env",

    // Listing all start scripts by NODE_ENV like this is way more concise and explicit.
    "start:development": "node src",
    "start:test": "npm test",
    "start:production": "node build",

    "test": "jest"
  }
}
```

`npm start` has long been the de facto way of starting a **Node.js** application.

Besides that, to ensure that our application runs in the mode we desired, `NODE_ENV` is often set as an environment variable. A lot of popular frameworks expect `NODE_ENV` to be set as well.

Why not combine both, so that when we execute `npm start` when `NODE_ENV=production`, `npm run start:production` will be spawned.

Similarly, executing `npm start` when `NODE_ENV=development` will spawn `npm run start:development`.

Even when `NODE_ENV=test`, `npm start` can set to spawn `npm run start:test` too. Some might disagree with this and would instead do `npm test`. However, you could set `{ "start:test": "npm test" }` in the **scripts** field as shown in the **package.json** above, so that if you execute `npm start` when `NODE_ENV=test`, `npm test` will be eventually spawned. In this way, the original command `npm test` is still accessible from your shell. So now you have two ways to launch your tests: `npm test` and `NODE_ENV=test npm start`.

Arbitrary **scripts** and `NODE_ENV` are both supported by **by-node-env**. Please refer to more examples below.

In short, in the context of **by-node-env**, the environment variable `NODE_ENV` acts as a switch to select the appropriate **scripts** specified in the **package.json** for execution.

## NODE_ENV

By design, **by-node-env** must resolve `NODE_ENV` ahead of starting your application to select the appropriate **scripts** in your **package.json** for execution. It then set the resolved `NODE_ENV` as `process.env.NODE_ENV` in your application runtime.

The priority order of resolving `NODE_ENV` is as follows:

1. Environment variable.
2. **.env** file in your project root directory.
3. Defaults to `development`.

Whichever `NODE_ENV` found first will take precedence.

**by-node-env** will only set `process.env.NODE_ENV` of your application to `NODE_ENV` it resolved. Other environment variables will be passed as is to your application in `process.env`. If a **.env** file is present in your project root directory, all entries except `NODE_ENV` are ignored.

In other words, **by-node-env** will not try to manipulate any environment variable of your application except `NODE_ENV`.

## Pre and Post Scripts

Both *pre* and *post* **scripts** of **package.json** are supported by **by-node-env**.

Given a **package.json** with *pre* and *post* **scripts** below:

```jsonc
{
  "scripts": {
    "prestart": "echo prestart",                              // 1
    "start": "echo start && by-node-env",                     // 2

    "prestart:development": "echo prestart:development",      // 3
    "start:development": "echo start:development",            // 4
    "poststart:development": "echo poststart:development",    // 5

    "prestart:production": "echo prestart:production",        // 3
    "start:production": "echo start:production",              // 4
    "poststart:production": "echo poststart:production",      // 5

    "poststart": "echo poststart"                             // 6
  }
}
```

The outputs of executing `NODE_ENV=production npm start` in ascending order are as follows:

1. `prestart`
2. `start`
3. `prestart:production`
4. `start:production`
5. `poststart:production`
6. `poststart`

This output order also implies the execution order of the **scripts**.

Any arbitrary **scripts** (other than *start*) and its corresponding *pre* and *post* **scripts** are also supported by **by-node-env**.

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
