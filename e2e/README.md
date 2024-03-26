# About

This folder contains an end to end testing suite written with playwright checking all of the main functionality provided by this template. Note it assumes you are using a postgres database on the backend and have configured a test database. This is required because the tests will **drop and recreate the test database** in order to ensure replicability between test runs.

This test suite was built off of using the [medusa-starter-default](https://github.com/medusajs/medusa-starter-default) repository with the seed data from `data/seed.json`.

# Setup

## .env

These tests have a number of dependent environment variables, with an example found in `.env.example`. You can setup your local environment by copying the example environment file

```sh
cat e2e/.env.example >> .env
```

and configuring the `.env` file from there. There are more details below about what the test values correspond to and how to set them. But we mention that

* `CLIENT_SERVER` - is the server the next server is listening on

## Playwright

In order to run these tests, make sure playwright and a playwright-enabled browser is installed. You can do this by running

```sh
npx playwright install
```

## Database

Note that **these tests drop and reset the database** after each test run. This means you will need to configure a separate test database based on your development or production database. We give some instructions for doing so, and enforce a rule which requires the test database to have the prefix `test_` in its name.

### Environment variables

- `TEST_POSTGRES_USER` - user for connecting to the test database, for example, `medusa`
- `TEST_POSTGRES_PASSWORD` - password for connecting to the test database, for example `my_secret_password`
- `TEST_POSTGRES_DATABASE` - name of the test database, must start with the prefix `test*`, for example `test_medusa_db`
- `TEST_POSTGRES_HOST` - optional - host for the postgres database, defaults to `localhost`
- `TEST_POSTGREST_PORT` - optional - host for the postgres
- `PRODUCTION_POSTGRES_DATABASE` - name of the production database, for example `medusa_db`

in addition, there are environment variables for connecting to the database as a superuser, so we can efficiently reset the database.

* `PGHOST` - host for the postgres instance
* `PGPORT` - port for the postgres instance
* `PGUSER` - superuser for the postgres instance
* `PGPASSWORD` - superuser password for the postgres instance
* `PGDATABASE` - database we connect to while updating the other databases

### Test Database Failsafes

There are a few failsafes to ensure the test and production databases don't get mixed up. This includes:

- Ensuring the production database doesn't have the same name as the test database
- Ensuring the test database starts with the prefix `test_`

Note running the test suite will trigger database drops and recreations of the test database.

### Using a separate database

If you need to run your project with a separate database, such as sqlite, MySQL, or something else, please refer to `seed/reset.ts` and implement your own `resetDatabase` function which can be run between test runs.

# Running the test suite

## Test environment

Before running the test suite, make sure to start the backend server the medusa client is using. In addition, make sure to run in the nextjs template directory

```sh
yarn build
```

so the project is built.

## Calling the tests

You can run the test suite in the base directory of the project with either

```sh
yarn test-e2e
```

or

```sh
npm run test-e2e
```

While the test suite is running, it is configured to automatically run the nextjs template during test execution.
