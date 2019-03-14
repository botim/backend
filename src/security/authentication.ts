import * as express from 'express';

import { AuthenticatedRequest } from '../models';
import { checkReporterKey } from '../data';
import { Cache, logger } from '../core';

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
    if (await checkReporterKey(authenticatedRequest.reporterKey)) {
      return;
    }
  }

  throw new Error('auth fail');
};
