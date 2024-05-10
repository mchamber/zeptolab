## Requirements

- Node.js 20.x or higher (recommended to use nvm)
- Docker with docker compose (either plugin or docker-compose)

## Features
- [X] RPC (ts-rest) over webserver (Express)
- [X] Validate request
- [X] Validate response
- [X] Store file in local database
- [X] Environment deployment by configuration
- [X] Transation in database (locking the local database)

## Quality features
- [X] Swagger API documentation
- [X] Unit and integration tests
- [X] Linting
- [X] Code coverage
- [X] Code style
- [X] README file
- [X] Read file sytem files in batches


## Future features
- [ ] Replace database with MongoDB

## Available Scripts

    npm run docker-compose

Run the server in docker-compose.

    npm run dev

Run the server in development mode.

    npm test

Run all unit-tests with hot-reloading.

    npm test -- --testFile="name of test file" (i.e. --testFile=Files).

Run a single unit-test.

    npm run test:no-reloading

Run all unit-tests without hot-reloading.

    npm run lint

Check for linting errors.

    npm run build

Build the project for production.

    npm start

Run the production build (Must be built first).

    npm start -- --env="name of env file" (default is production).

Run production build with a different env file.


