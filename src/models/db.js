var pgp = require('pg-promise')(/*options*/);
const { DATABASE_URL } = process.env;

exports.db = pgp(DATABASE_URL);

