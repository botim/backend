# Bots backend

Based on https://github.com/vmasto/express-babel: Express.js with Babel Boilerplate.

Using TSOA Routing https://github.com/lukeautry/tsoa.

### Deployment

Deployed on Heroku

### DB

Using postgres.
Copy `.env.example` into `.env` and update the variables to match your environment, or define local variable named DATABASE_URL of the form `postgres://user:pass@localhost:5432/bots_db`

Install locally by running:

```bash
$ psql postgres
CREATE ROLE bots WITH LOGIN PASSWORD 'yourpass';
ALTER ROLE bots CREATEDB;

$ psql postgres -U bots
CREATE DATABASE bots_db;
GRANT ALL PRIVILEGES ON DATABASE bots_db TO bots;
CREATE TYPE platform AS ENUM('TWITTER', 'FACEBOOK', 'INSTAGRAM');
CREATE TYPE reason AS ENUM('BOT', 'VIOLENCE', 'FAKE');
CREATE TYPE status AS ENUM('REPORTED', 'IN_PROCESS', 'BOT', 'NOT_BOT');

DROP TABLE IF EXISTS botim;
CREATE TABLE botim (ID SERIAL PRIMARY KEY, user_id VARCHAR(30), comment_id VARCHAR(30), replay_comment_id VARCHAR(30), platform platform, reasons reason[], status status, description VARCHAR(200), reporter_key VARCHAR(30));

DROP TABLE IF EXISTS reporters;
CREATE TABLE reporters (ID SERIAL PRIMARY KEY, reporter_key VARCHAR(30));

```

### Run Example

enter in command line:

- `npm i`
- `DATABASE_URL='postgres://user:pass@localhost:5432/bots_db'`
- `npm run start`

### API

read [swagger.yaml](./swagger.yaml) file.

### Updating suspected to confirmed bots

The reports go to `botim` table.

And the reporters API key checks against `reporters` table.

### Configuration

environment variables:

- `DATABASE_URL` DB URI.
- `PORT` HTTP Port. (default 8080).
- `REQUESTS_LIMIT` Maximum requests in 10 minutes window per IP. (default 1000).
- `CACHE_TTL` Liveness of a bots cache, in seconds. (default 3600 = houre).
- `CACHE_CHECK_PERIOD` Interval of cache liveness check. (default 1800 = 30 minutes).
