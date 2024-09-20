# User DB API

This is a backend tech test for a company who would likely rather not appear on Google. Rhymes with Wrinkle.

This document contains instructions for running the app locally, and a discussion of the development process.

## Local setup

After cloning the repo, install dependencies:

```bash
npm install
```

The app is built with [Prisma](https://www.prisma.io/) as an ORM. Prisma requires a `DATABASE_URL` value in the environment, and migrations to set up the database tables.

```bash
# copy the example environment values to the real deal
cp .env.example .env
# run migrations
npx prisma migrate dev
```

Optionally, the database can be seeded with some rows once Prisma has been set up.

```bash
# optional
npx ts-node script.ts
```

If successful, a list of objects representing the created rows will be logged to the console.

Finally the app can be run in dev mode:

```bash
npm run dev
```

## Automated testing

Run tests:

```bash
npm test
```

## Manual testing with Bruno

The `/bruno` folder contains queries which can be opened with [Bruno](https://www.usebruno.com/) (similar to Postman, Insomnia...).

- Install Bruno (`brew install bruno` works)
- From the top-left `...` menu select "Open Collection" and navigate to this repo's `/bruno` folder. Open the whole folder.
- Each tab contains a query.
- Run a query with the → right arrow button to the right of the window.

## Manual testing with something else

There are two endpoints:

### `POST /api/v1/users`

Expects a JSON body, for example:

```json
{
  "name": "Alan",
  "email": "alan@hireme.io",
  "password": "Hunter22",
  "type": "TEACHER"
}
```

Possible values for `type` are:

- `"TEACHER"`
- `"STUDENT"`
- `"PARENT"`
- `"PRIVATE_TUTOR"`

On success the API responds with status code `201` and the created object (omitting the password for security).

If fields are missing or invalid the API responds with status code `422` and error messages.

### `GET /api/v1/users/:id`

IDs are sequential numbers starting from 1 and are not reassigned if deleted.

Responds with status code `200` and the user object if found (omitting the password for security).

If the ID is not found, responds with a `404` status code and no body.

## Notes

The app is a bare Express app, roughly following an MVC architecture, with [Prisma](https://www.prisma.io/) as an ORM.

My Node API framework of choice is normally [Nest.js](https://nestjs.com/), but it felt like overkill for this project.

The User model (`/src/models/User.ts`) is just a couple of functions to encapsulate Prisma operations. Input validation is handled here with [Zod](https://zod.dev/), including the password requirements detailed in the brief. This file could easily have been a class but again, it felt like overkill for the requirements. If the User required full CRUD functionality the model would have been a class.

The UserController (`/src/controllers/UserController.ts`) defines the endpoint URLs, delegates to the User model for DB operations and sends the appropriate HTTP responses.

The UserController tests (`/src/controllers/UserController.test.ts`) use [Supertest](https://www.npmjs.com/package/supertest) to test the API endpoints with a mocked Prisma instance. Valid inputs and responses are tested, with the password requirements tested for appropriate failures.

The only limitation of Prisma here was that it does not support enum data types for SQLite, only for PostgreSQL and MS SQL Server ([related issue](https://github.com/prisma/prisma/issues/2219)). An enum is technically the right choice for the `user.type` field, but since it is not possible here the data type had to be a `String` with the validation happening in the application layer. It's not optimal but it works.
