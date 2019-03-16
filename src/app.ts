import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as cors from 'cors';
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { sanitizeExpressMiddleware, sanitizeJsonSync } from 'generic-json-sanitizer';
import { createConnection } from 'typeorm';

import { logger } from './core';

import { RegisterRoutes } from './routers/routes';

// controllers need to be referenced in order to get crawled by the TSOA generator
import './controllers/user-statuses-controller';

class App {
  public express: express.Express;

  constructor() {
    /** Creat the express app */
    this.express = express();

    /** Security is the first thing, right?  */
    this._vulnerabilityProtection();

    /** Parse the request */
    this._dataParsing();

    /** After data parsed, sanitize it. */
    this._sanitizeData();

    /** Route inner system */
    this._routes();

    /** Never sent errors back to client. */
    this._catchErrors();

    /** Connect to the database. */
    this._initDatabase();
  }

  /**
   * Route requests to API.
   */
  private _routes(): void {
    /** Use generated routers (by TSOA) */
    RegisterRoutes(this.express);

    /** redirect to the website when user access the root path */
    this.express.get('/', (req: express.Request, res: express.Response) =>
      res.redirect('https://botim.online')
    );
  }

  /**
   * Protect from many vulnerabilities ,by http headers such as HSTS HTTPS redirect etc.
   */
  private _vulnerabilityProtection(): void {
    // Protect from DDOS and access thieves
    const limiter = new RateLimit({
      windowMs: 10 * 60 * 1000,
      max: process.env.REQUESTS_LIMIT || 1000
    });

    //  apply to all  IP requests
    this.express.use(limiter);

    // Protect from XSS and other malicious attacks
    this.express.use(helmet());
    this.express.use(helmet.frameguard({ action: 'deny' }));

    // Allow access from browser extension, otherwise the request fails CORS
    this.express.use(cors());
  }

  /**
   * Parse request query and body.
   */
  private _dataParsing(): void {
    this.express.use(bodyParser.json({ limit: '2mb' })); // for parsing application/json
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  /**
   * Sanitize Json schema arrived from client.
   * to avoid stored XSS issues.
   */
  private _sanitizeData(): void {
    // sanitize body.
    this.express.use(
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        sanitizeExpressMiddleware(req, res, next, {
          allowedAttributes: {},
          allowedTags: []
        });
      }
    );

    // sanitize query.
    this.express.use(
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        sanitizeJsonSync(req.query);
        next();
      }
    );
  }

  /**
   * Catch any Node / JS error.
   */
  private _catchErrors() {
    // Unknowon routing get 404
    this.express.use('*', (req, res) => {
      res.statusCode = 404;
      res.send();
    });

    /**
     * Production error handler, no stacktraces leaked to user.
     */
    this.express.use(
      (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        try {
          logger.warn(
            `express route crash,  req: ${req.method} ${req.path} error: ${
              err.message
            } body: ${JSON.stringify(req.body)}`
          );
        } catch (error) {
          logger.error(`Ok... even the crash route catcher crashed...`);
        }
        res.status(500).send();
      }
    );
  }

  /**
   * Connect to the database, using the configuration in ormconfig.js
   */
  private async _initDatabase() {
    try {
      await createConnection();
      logger.info('successfully connected to DB.');
    } catch (error) {
      logger.fatal('DB connection failed, exiting...', error);
      process.exit();
    }
  }
}

export default new App().express;
