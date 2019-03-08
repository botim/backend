# Bots backend

Based on https://github.com/vmasto/express-babel: Express.js with Babel Boilerplate.

Using TSOA Routing https://github.com/lukeautry/tsoa.

### Deployment

Deployed on Heroku

### DB

Using postgres. Define local variable named DATABASE_URL of the form `postgres://user:pass@localhost:5432/bots_db`

Install locally by running:

```
$ psql postgres
> CREATE ROLE bots WITH LOGIN PASSWORD 'yourpass';
> ALTER ROLE bots CREATEDB;

$ psql postgres -U bots
> CREATE DATABASE bots_db;
> GRANT ALL PRIVILEGES ON DATABASE bots_db TO bots;
> CREATE TABLE suspectedBots (ID SERIAL PRIMARY KEY, userId VARCHAR(30), platform VARCHAR(30), botReason VARCHAR(30), description VARCHAR(200), reporterKey VARCHAR(30));
> CREATE TABLE confirmedBots (ID SERIAL PRIMARY KEY, userId VARCHAR(30), platform VARCHAR(30), detectionStatus VARCHAR(30), botReason VARCHAR(30));
> CREATE TABLE reporters (ID SERIAL PRIMARY KEY, reporterKey VARCHAR(30));

```
### Run Example

enter in command line:
* `npm i`
* `DATABASE_URL='postgres://user:pass@localhost:5432/bots_db'`
* `npm run start`

### API

read [swagger.yaml](./swagger.yaml) file.

### Updating suspected to confirmed bots

The reports go to `suspectedBots` table.

The confirmed bots read from `confirmedBots` table.

And the reporters API key checks against `reporters` table.

### Configuration

environment variables:

* `DATABASE_URL` DB URI. 
* `PORT` HTTP Port. (default 8080).
* `REQUESTS_LIMIT` Maximum requests in 10 minutes window per IP. (default 1000).
