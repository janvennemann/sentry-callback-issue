# sentry-callback-issue

This is an example project with several use cases to show possible issues with callback based async code in Sentry. Based on the example from [Sentry for Express](https://docs.sentry.io/platforms/node/guides/express/).

## Prerequisites

- [Docker](https://www.docker.com/)

## Setup

Install dependencies

```sh
yarn
```

and update the `Sentry.init` call in `index.js` to use your Sentry DSN.

Now start the required docker container and express server with

```sh
yarn dev
```

## Test cases

- `http://localhost:3000/debug-sentry`: Example error taken from docs. Everythings works as expected here and request related info like Browser, OS, Cookies, Headers etc. are included in the generated Sentry issue.
- `http://localhost:3000/debug-sentry-mongo`: Callback based query to a mongodb. Request related info is **not** included in the generated Sentry issue.
- `http://localhost:3000/debug-sentry-mongo-promise`: Same as above, but instead uses promise based API. Everythings works as expected again here and request related info is included in the generated Sentry issue.
- `http://localhost:3000/debug-sentry-callback`: Super simple example using only `setTimeout`. Request realted info is **not** included in the generated Sentry issue.
