# Bots backend

Based on https://github.com/vmasto/express-babel: Express.js with Babel Boilerplate

### Deployment

Deployed on Heroku

### DB

Using postgres. Define local variable named DATABASE_URL of the form postgres://user:pass@localhost:5432/bots_db

Install locally by running:

```
$ psql postgres
> CREATE ROLE bots WITH LOGIN PASSWORD 'yourpass';
> ALTER ROLE bots CREATEDB;

$ psql postgres -U bots
> CREATE DATABASE bots_db;
> GRANT ALL PRIVILEGES ON DATABASE bots_db TO bots; postgres=> \list
> CREATE TABLE suspectedBots (ID SERIAL PRIMARY KEY, userId VARCHAR(30), isBot BOOLEAN);

```

### API

save new suspected bot:

```
Post: http://localhost:8080/suspected?userId=123456
```

Response:
```
{
  "id": {
    "id": 1
  }
}
```

Get all confirmed bots:
```
Get: http://localhost:8080/confirmed
```

Response:
```
{
  "botIds": [
    {
      "userid": "123456"
    }
  ]
}
```

### Updating suspected to confirmed bots

Currently all the new suspected are saved as isBot: false.
The logic to confirm bots is not implemented.

To mark a bot, connect to the DB on Heroku, and run:
```
Update suspectedbots set isbot=true where id=11;
```
