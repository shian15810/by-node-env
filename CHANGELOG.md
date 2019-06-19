# Changelog

## 1.0.0 (2019-06-11)

- Cloned original repository from [**github:ericclemmons/per-env**](https://github.com/ericclemmons/per-env).
- Added support for **Windows** with [**cross-spawn**](https://www.npmjs.com/package/cross-spawn).
- Added support for **Yarn** by detecting `process.env.npm_execpath`.

## 1.0.1 (2019-06-12)

- Fixed some typos.

## 1.0.2 (2019-06-12)

- Updated README.

## 1.0.3 (2019-06-12)

- Refactored some codes.

## 1.1.0 (2019-06-14)

- Changed support of **Yarn** from `process.env.npm_execpath` to [**which-pm-runs**](https://www.npmjs.com/package/which-pm-runs) which detects `process.env.npm_config_user_agent`, with additional **pnpm** support.

## 1.1.1 (2019-06-17)

- Supported fallback to `process.env.npm_execpath` if `process.env.npm_config_user_agent` by [**which-pm-runs**](https://www.npmjs.com/package/which-pm-runs) is `undefined`.

## 1.2.0 (2019-06-19)

- Defaulted `NODE_ENV` to defined `NODE_ENV` in **.env** file if it is found in `process.cwd()`. `.env` file is parsed using [**dotenv**](https://www.npmjs.com/package/dotenv).
