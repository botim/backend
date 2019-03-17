# Bots backend

Based on https://github.com/vmasto/express-babel: Express.js with Babel Boilerplate.

Using TSOA Routing https://github.com/lukeautry/tsoa.

### Deployment

Deployed on Heroku

### DB

Using postgres.
Copy `.env.example` into `.env` and update the variables to match your environment, or define local variable named DATABASE_URL of the form `postgres://user:pass@localhost:5432/bots_db`

Install locally:

1. Create Database and User:

   ```bash
   $ psql postgres
   CREATE ROLE bots WITH LOGIN PASSWORD 'yourpass';
   ALTER ROLE bots CREATEDB;

   $ psql postgres -U bots
   CREATE DATABASE bots_db;
   GRANT ALL PRIVILEGES ON DATABASE bots_db TO bots;
   ```

2. Run migrations to create tables:

   ```bash
   npm run migrate

   # to revert the last migration
   npm run migrate:revert
   ```

### Run Example

enter in command line:

- `npm i`
- `DATABASE_URL='postgres://user:pass@localhost:5432/bots_db'`
- `npm run start`

### API

read [swagger.yaml](./swagger.yaml) file.

### Updating suspected to confirmed bots

The reports go to `user_statuses` table.

And the reporters API key checks against `reporters` table.

### Analysts dashboard

Build the angular dashboard project. see [README](./dashboard/README.md).

Run the backend with `ALLOW_ANALYSTS_API=true` and open browser in `localhost:8080/analysts`.

### Configuration

environment variables:

- `DATABASE_URL` DB URI.
- `PORT` HTTP Port. (default 8080).
- `REQUESTS_LIMIT` Maximum requests in 10 minutes window per IP. (default 1000).
- `USERS_CACHE_TTL` Liveness of a user status cache, in seconds. (default 1 second).
- `USERS_CACHE_CHECK_PERIOD` Interval of cache liveness check. (default 0).
- `ALLOW_ANALYSTS_API` Open the analysts API, so bot status can be updated without any authentication, use it carefully and only in a closed network. (default is of course 'false').
