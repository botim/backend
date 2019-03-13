import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';

import { UserStatus, Reporter } from '../models';

const { DATABASE_URL } = process.env;

let connectionDriver: Connection;
createConnection({
  url: DATABASE_URL,
  type: 'postgres',
  entities: [UserStatus, Reporter],
  synchronize: false,
  logging: false
})
  .then(connection => {
    console.log('successfully connected to DB.');
    connectionDriver = connection;
  })
  .catch(error => {
    console.error(error);
    console.error('DB connection failed, exiting...');
    process.exit();
  });

export const getConnection = (): Connection => {
  if (!connectionDriver) {
    throw new Error('connection to DB not established yet.');
  }

  return connectionDriver;
};
