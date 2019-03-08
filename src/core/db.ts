import * as pgp from 'pg-promise';

const { DATABASE_URL } = process.env;

/** Get PGP DB connection driver. */
export const db = pgp({})(DATABASE_URL);
