var pgp = require('pg-promise')(/*options*/);
const { DB_URL } = process.env;

exports.db = pgp(DB_URL);

