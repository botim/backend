import * as express from 'express';
import { Application, NextFunction, Request, Response } from 'express';
import { AuthedRequest } from '../models/symbols';
import { expressAuthentication as localExpressAuthentication } from './authentication';
import { getReporter } from '../data/reporters';

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

	// Make sure that thare is body, and the body containce api key.
	const authedRequest: AuthedRequest = request.body;
	if (authedRequest && authedRequest.reporterKey) {
		if (await getReporter(authedRequest.reporterKey)) {
			return;
		}
	}

	throw new Error('auth fail');
};
