import * as express from 'express';
import * as NodeCache from 'node-cache';
import * as moment from 'moment';

import { AuthenticatedRequest } from '../models';
import { checkReporterKey } from '../data';
import { Cache, logger } from '../core';

const reportersAuthCache = new Cache(moment.duration(2, 'hours'));

/**
 * Cert Authentication middelwhere API.
 * the key should be the 'reporterKey' property in the body.
 */
export const expressAuthentication = async (request: express.Request, scopes: string[]) => {
  /** If the routing security sent wrong security scope. */
  if (!scopes || scopes.length < 1) {
    logger.error('invalid or empty security scope');
    throw new Error('scope check fail');
  }

  /** Make sure that there is a body, and the body contains the API key. */
  const authenticatedRequest: AuthenticatedRequest = request.body;
  if (authenticatedRequest && authenticatedRequest.reporterKey) {
    /** Before geting data from DB, try to get access from cache. */
    const reporterAccess = await reportersAuthCache.get(authenticatedRequest.reporterKey);

    /** If access cached as 'true' */
    if (reporterAccess) {
      return;
    }

    /** If access not cached yet */
    if (reporterAccess === undefined) {
      const reporterAccess: boolean = await checkReporterKey(authenticatedRequest.reporterKey);
      await reportersAuthCache.set(authenticatedRequest.reporterKey, reporterAccess);

      if (reporterAccess) {
        return;
      }
    }
  }

  throw new Error('auth fail');
};
