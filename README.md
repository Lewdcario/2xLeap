# GoodLeap Project

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

## API Usage

* GET / - Hello World output, simple testing and open endpoint to verify the API is alive
* GET /items - Protected endpoint, requires a valid token to access, lists items
* POST /items - Protected endpoint, requires a valid token to access, adds an item to the list
* GET /items/:id - Protected endpoint, requires a valid token to access, gets an item by id
* PATCH /items/:id/complete - Protected endpoint, requires a valid token to access, marks an item as complete
* DELETE /items/:id - Protected endpoint, requires a valid token to access, deletes an item by id
* Requests are protected through `Bearer-token` which is provided in the `.env` file

## Notes

* First time using NestJS so a lot of this is a learning experience, I like to learn new frameworks
* Went over the boundary time of 2 hours
* Test coverage should be 100% - covered caching, invalid inputs, and the like. Just ignored app due to time constraints
* Basic rate limiter implemented
* Implemented super basic authentication due to lack of more time to spend. Also added a @Public() decorator to allow for public endpoints
* I did not create tests for throttling and authentication due to time constraints, but one can verify the authentication is working by visiting / (public) and /items (protected). The tests will demonstrate the routes work, or you can add @Public() to test it yourself.
* Sensitive information is in `.env`, but in a real project, much of this would remain a protected secret, naturally
* For caching, I would seriously consider redis, but I used in memory DB and caching for this project
* With more time I would more consistently adopt ZOD for schema validation, but the project is a bit inconsistent right now due to time
* Would setup husky and lint-staged and ci/cd pipeline for a real project
* With more time, would make sure swagger or similar is setup for automatically generated documentation
* With more time I would also make it a bit easier to test and make the seeder work in the main application outside of just seeing if the tests run
* e2e tests were also implemented, run `yarn test`, `yarn test:e2e` and `yarn test:cov` to see the results
