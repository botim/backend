import * as express from 'express';
import * as NodeCache from 'node-cache';
import { Application, NextFunction, Request, Response } from 'express';
import { AuthedRequest } from '../models/symbols';
import { expressAuthentication as localExpressAuthentication } from './authentication';
import { getReporter } from '../data/reporters';

const reportesCache = new NodeCache({
	stdTTL: 60 * 60 * 2, // Each 2 hours reread key from db.
	checkperiod: 60 * 30 // Clear cache every 30 minutes.
});

/**
 * Cert Authentication middelwhere API.
 * the auth token should be the value of 'session' cookie.
 * @param securityName Used as auth scope beacuse of poor scopes swaggger support in apiKey auth.
 */
export const expressAuthentication = async (request: express.Request, scopes: string[]) => {
	// If the routing security sent wrong security scope.
	if (!scopes || scopes.length < 1) {
		console.error('invalid or empty security scope');
		throw new Error('scope check fail');
	}

	// Make sure that there is body, and the body containce api key.
	const authedRequest: AuthedRequest = request.body;
	if (authedRequest && authedRequest.reporterKey) {
		// Case API ket valid in cache, it's enough.
		if (reportesCache.get(authedRequest.reporterKey)) {
			return;
		}

		// Check API of reporter
		if (await getReporter(authedRequest.reporterKey)) {
			// Save it in cache.
			reportesCache.set(authedRequest.reporterKey, true);
			return;
		}
	}

	throw new Error('auth fail');
};
