import * as express from 'express';
import * as NodeCache from 'node-cache';

import { AuthenticatedRequest } from '../models';
import { checkReporterKey } from '../data';

const reportersCache = new NodeCache({
  stdTTL: 60 * 60 * 2, // Every 2 hours reread key from DB.
  checkperiod: 60 * 30 // Clear old cache every 30 minutes.
});

/**
 * Cert Authentication middelwhere API.
 * the key should be the 'reporterKey' property in the body.
 */
export const expressAuthentication = async (request: express.Request, scopes: string[]) => {
  /** If the routing security sent wrong security scope. */
  if (!scopes || scopes.length < 1) {
    console.error('invalid or empty security scope');
    throw new Error('scope check fail');
  }

  /** Make sure that there is a body, and the body contains the API key. */
  const authenticatedRequest: AuthenticatedRequest = request.body;
  if (authenticatedRequest && authenticatedRequest.reporterKey) {
    // If API key valid in cache, it's enough.
    if (reportersCache.get(authenticatedRequest.reporterKey)) {
      return;
    }

    /** Check API key of the reporter. */
    if (await checkReporterKey(authenticatedRequest.reporterKey)) {
      /** Save it in the cache. */
      reportersCache.set(authenticatedRequest.reporterKey, true);
      return;
    }
  }

  throw new Error('auth fail');
};
