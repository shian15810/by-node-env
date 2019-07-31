# Changelog

## 1.0.0 (2019-06-11)

-   Cloned original repository from [**github:ericclemmons/per-env**](https://github.com/ericclemmons/per-env).
-   Added support for **Windows** with [**cross-spawn**](https://www.npmjs.com/package/cross-spawn).
-   Added support for **Yarn** by detecting `process.env.npm_execpath`.

## 1.0.1 (2019-06-12)

-   Fixed some typos.

## 1.0.2 (2019-06-12)

-   Updated README.

## 1.0.3 (2019-06-12)

-   Refactored some codes.

## 1.1.0 (2019-06-14)

-   Changed support of **Yarn** from `process.env.npm_execpath` to [**which-pm-runs**](https://www.npmjs.com/package/which-pm-runs) which detects `process.env.npm_config_user_agent`, with additional **pnpm** support.

## 1.1.1 (2019-06-17)

-   Supported fallback to `process.env.npm_execpath` if `process.env.npm_config_user_agent` by [**which-pm-runs**](https://www.npmjs.com/package/which-pm-runs) is `undefined`.

## 1.2.0 (2019-06-19)

-   Defaulted `NODE_ENV` to defined `NODE_ENV` in **.env** file if it is found in `process.cwd()`. `.env` file is parsed using [**dotenv**](https://www.npmjs.com/package/dotenv).

## 1.3.0 (2019-06-26)

-   Solved some testing issues on **Windows**.
-   Restructured repository.
-   Replaced **Yarn** with **npm**.

## 2.0.0 (2019-07-31)

-   Rewritten in [**TypeScript**](https://www.typescriptlang.org/).
-   Replaced **npm** with **Yarn**.
-   Replaced [**cross-spawn**](https://www.npmjs.com/package/cross-spawn) with [**execa**](https://www.npmjs.com/package/execa).
-   Exported a default function for programmatic use.
-   Parsed cli options using [**commander**](https://www.npmjs.com/package/commander).
-   Exposed optional `--env-file` and `--package-manager` options via cli.
-   **Breaking change**: `.env` file is no longer parsed by default if present. It will only be parsed if provided along with `--env-file` option via cli.

## 2.0.1 (2019-07-31)

-   Suppressed duplicated cli error thrown by [**execa**](https://www.npmjs.com/package/execa).
-   Replaced **Yarn** with **npm**.
