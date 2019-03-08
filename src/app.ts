import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import * as path from 'path';
import { RegisterRoutes } from './routers/routes';
import { sanitizeExpressMiddleware } from 'generic-json-sanitizer';

// controllers need to be referenced in order to get crawled by the TSOA generator
import './controllers/botim-controller';

class App {
	public express: express.Express;

	constructor() {
		/** Creat the express app */
		this.express = express();

		/** Security is the first thing, right?  */
		this.vulnerabilityProtection();

		/** Parse the request */
		this.dataParsing();

		/** After data parsed, sanitize it. */
		this.sanitizeData();

		/** Serve static client side */
		this.serveStatic();

		/** Route inner system */
		this.routes();

		/** And never sent errors back to client. */
		this.catchErrors();
	}

	/**
     * Serve static files of front-end.
     */
	private serveStatic() {
		/** In / path only serve the index.html file */
		this.express.get('/', (req: express.Request, res: express.Response) =>
			res.sendFile(path.join(__dirname, '/public/static/index.html'))
		);
		/** Get any file in public directory */
		this.express.use('/static', express.static(path.join(__dirname, '/public/static/')));
	}

	/**
     * Route requests to API.
     */
	private routes(): void {
		/** Use generated routers (by TSOA) */
		RegisterRoutes(this.express);
	}

	/**
     * Protect from many vulnerabilities ,by http headers such as HSTS HTTPS redirect etc.
     */
	private vulnerabilityProtection(): void {
		// Protect from DDOS and access thieves
		const limiter = new RateLimit({
			windowMs: 10 * 60 * 1000,
			max: 1000
		});

		//  apply to all  IP requests
		this.express.use(limiter);

		// Protect from XSS and other malicious attacks
		this.express.use(helmet());
		this.express.use(helmet.frameguard({ action: 'deny' }));

		this.express.disable('x-powered-by');
	}

	/**
     * Parse request query and body.
     */
	private dataParsing(): void {
		this.express.use(bodyParser.json({ limit: '2mb' })); // for parsing application/json
		this.express.use(bodyParser.urlencoded({ extended: false }));
	}

	/**
     * Sanitize Json schema arrived from client.
     * to avoid stored XSS issues.
     */
	private sanitizeData(): void {

		// TODO: sanitize query.
		this.express.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
			sanitizeExpressMiddleware(req, res, next, {
				allowedAttributes: {},
				allowedTags: []
			});
		});
	}

	/**
     * Catch any Node / JS error.
     */
	private catchErrors() {
		// Unknowon routing get 404
		this.express.use('*', (req, res) => {
			res.statusCode = 404;
			res.send();
		});

		/**
         * Production error handler, no stacktraces leaked to user.
         */
		this.express.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
			try {
				console.warn(
					`express route crash,  req: ${req.method} ${req.path} error: ${err.message} body: ${JSON.stringify(
						req.body
					)}`
				);
			} catch (error) {
				console.warn(`Ok... even the crash route catcher crashd...`);
			}
			res.status(500).send();
		});
	}
}

export default new App().express;
