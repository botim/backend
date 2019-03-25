# Bots backend

Based on https://github.com/vmasto/express-babel: Express.js with Babel Boilerplate.

Using TSOA Routing https://github.com/lukeautry/tsoa.

### Deployment

Deployed on Heroku

### DB

You could install [Postgres](https://www.postgresql.org/download/) directrly on your computer, or install [Docker](https://www.docker.com/products/docker-desktop) and then use the `docker-compose` to run the container:

```bash
docker-compose up

# shutdown the container
docker-compose down
```

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

### Configuration

environment variables:

- `DATABASE_URL` DB URI.
- `PORT` HTTP Port. (default 8080).
- `REQUESTS_LIMIT` Maximum requests in 10 minutes window per IP. (default 1000).
- `USERS_CACHE_TTL` Liveness of a user status cache, in seconds. (default 1 second).
- `USERS_CACHE_CHECK_PERIOD` Interval of cache liveness check. (default 0).
