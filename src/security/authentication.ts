import * as express from 'express';

import { AuthenticatedRequest } from '../models';
import { checkReporterKey } from '../data';
import { logger } from '../core';

const { ALLOW_ANALYSTS_API } = process.env;
const allowAnalystsAccess = ALLOW_ANALYSTS_API === 'true';
if (!allowAnalystsAccess) {
  console.info(
    '\n------------------------NOTICE---------------------------------\n' +
      '*             The analysts API are CLOSED.                    *\n' +
      '---------------------------------------------------------------\n'
  );
} else {
  console.warn(
    '\n------------------------NOTICE----------------------------------\n' +
      '* The analysts API are TOTALLY OPEN without any authentication,*\n' +
      '* Make sure the server runs on a closed network,               *\n' +
      '* Otherwise, anyone can manipulate data.                       *\n' +
      '----------------------------------------------------------------\n'
  );
}

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

  if (scopes.indexOf('analystsAuth') !== -1) {
    if (allowAnalystsAccess) {
      return;
    }
    throw new Error('Analysts API are closed');
  }

  if (scopes.indexOf('reporterAuth') !== -1) {
    /** Make sure that there is a body, and the body contains the API key. */
    const authenticatedRequest: AuthenticatedRequest = request.body;
    if (authenticatedRequest && authenticatedRequest.reporterKey) {
      if (await checkReporterKey(authenticatedRequest.reporterKey)) {
        return;
      }
    }
  }

  throw new Error('auth fail');
};
