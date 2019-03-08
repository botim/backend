import * as pgp from 'pg-promise';

const { DATABASE_URL } = process.env;

/** Get PGP DB connection driver. */

console.log("DATABASE_URL", DATABASE_URL)
export const db = pgp({})(DATABASE_URL);
