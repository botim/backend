import * as express from 'express';
import * as jwt from 'jsonwebtoken';

import { checkReporterKey } from '../data';
import { logger, SignedInfo, Scopes } from '../core';
import { jwtSecret } from '../controllers/auth-controller';
import { TOKEN_HEADER, TOKEN_HEADER_PREFIX } from '../core/config';

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
  if (scopes.indexOf(Scopes.REPORTER_AUTH) !== -1) {
    const reporterKey = request.header(TOKEN_HEADER);
    if (await checkReporterKey(reporterKey)) {
      return;
    }
  } else {
    const jwtToken = request.header(TOKEN_HEADER).replace(TOKEN_HEADER_PREFIX, '');

    // TODO: check against a blacklist of valid token that should block.
    const signedInfo = jwt.verify(jwtToken, jwtSecret) as SignedInfo;

    /** Allow access only if the scope of JWT match to one of the security scopes rule. */
    if (scopes.indexOf(signedInfo.scope) !== -1) {
      request.user = signedInfo.username;
      return;
    }
  }

  throw new Error('auth fail');
};
