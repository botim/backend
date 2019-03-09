import * as pgp from 'pg-promise';

const { DATABASE_URL } = process.env;

export const db = pgp({})(DATABASE_URL);
