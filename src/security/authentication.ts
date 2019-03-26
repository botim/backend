import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { checkReporterKey } from '../data';
import { logger } from '../core';
import { jwtSecret } from '../controllers/auth-controller';

/**
 * Cert Authentication middleware API.
 * the key should be the 'reporterKey' property in the body.
 */
export const expressAuthentication = async (request: express.Request, scopes: string[]) => {
  /** If the routing security sent wrong security scope. */
  if (!scopes || scopes.length < 1) {
    logger.error('invalid or empty security scope');
    throw new Error('scope check fail');
  }

  /** Handle JWT tokens */
  if (scopes.indexOf('jwtAuth') !== -1) {
    const jwtToken = request.header('jwt');

    // TODO: check against a blacklist of valid token that should block.
    const { username } = jwt.verify(jwtToken, jwtSecret) as { username: string };
    request.user = username;
    return;
  }

  /** Make sure that there is a body, and the body contains the API key. */
  const reporterKey = request.header('Authorization');
  if (await checkReporterKey(reporterKey)) {
    return;
  }

  throw new Error('auth fail');
};
