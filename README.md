# Interview Project - Branch for [Vestwell](https://www.vestwell.com/careers/6026703003?gh_jid=6026703003)

## Installation

```bash
yarn install
```

## Running the app

```bash
# development
yarn run start

# watch mode
yarn run start:dev

# production mode
yarn run start:prod
```

## Test

```bash
# unit tests
yarn run test

# e2e tests
yarn run test:e2e

# test coverage
yarn run test:cov
```

## Basic Requirements for RESTful API

1. GET /items should return a list of not completed tasks
2. PATCH /items/:id/complete should complete the task
3. DELETE /items/:id should mark the item for
4. POST /items should insert new items

This has been branched out & converted to fulfill those basic requirements through GraphQL

## API Usage

-   GET / - Hello World output, simple testing and open endpoint to verify the API is alive
-   GET /items - Protected endpoint, requires a valid token to access, lists items
-   POST /items - Protected endpoint, requires a valid token to access, adds an item to the list
-   GET /items/:id - Protected endpoint, requires a valid token to access, gets an item by id
-   PATCH /items/:id/complete - Protected endpoint, requires a valid token to access, marks an item as complete
-   DELETE /items/:id - Protected endpoint, requires a valid token to access, deletes an item by id
-   Requests are protected through `Bearer-token` which is provided in the `.env` file

## Notes

-   Test coverage should be 100% - covered caching, invalid inputs, and the like
-   Basic rate limiter implemented
-   Implemented super basic authentication due to lack of more time to spend. Also added a @Public() decorator to allow for public endpoints
-   I did not create tests for throttling and authentication due to time constraints, but one can verify the authentication is working by visiting / (public) and /items (protected). The tests will demonstrate the routes work, or you can add @Public() to test it yourself.
-   Sensitive information is in `.env`, but in a real project, much of this would remain a protected secret, naturally
-   For caching, I would seriously consider redis, but I used in memory DB and caching for this project

## Known Issues

-   There's an issue where after adding package files, the tests don't want to run anymore, switching to SWC didn't resolve this. I included pictures so in case that happens it is still demonstrated that the tests passed
-   E2E tests are temporarily broken and I don't want to waste significantly more time fixing that right now, so just pretend it works, please.
-   Some conflicts with Prettier and ESLint
-   Add logger interceptor

## Demonstration of Tests working

The images of test results have been stored in /images so preview.

## Setup

1. Initialise with this command:

```bash
yarn prisma migrate dev --name 2xleap --schema ./src/database/schema.prisma
```
