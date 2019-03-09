import * as http from 'http';
import app from './app';

// Start HTTP application
const httpPort = process.env.PORT || 8080;

const server: any = http.createServer(app).listen(httpPort, () => {
    console.info(`HTTP listen on port ${httpPort}`);
});
