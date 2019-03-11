import * as http from 'http';
import * as dotenv from 'dotenv';
import { existsSync } from 'fs';

// load environment variable from .env file
if (existsSync('.env')) {
  dotenv.config();
}

import app from './app';

// Start HTTP application
const httpPort = process.env.PORT || 8080;

const server: any = http.createServer(app).listen(httpPort, () => {
  console.info(`HTTP listen on port ${httpPort}`);
});
