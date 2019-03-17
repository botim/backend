import * as express from 'express';

import { checkReporterKey } from '../data';
import { logger } from '../core';

const { ALLOW_ANALYSTS_API } = process.env;
const allowAnalystsAccess = ALLOW_ANALYSTS_API === 'true';
if (!allowAnalystsAccess) {
  logger.info('The analysts API are CLOSED.');
  console.info(
    '------------------------NOTICE---------------------------------\n' +
      '*             The analysts API are CLOSED.                    *\n' +
      '---------------------------------------------------------------\n'
  );
} else {
  logger.info('The analysts API are TOTALLY OPEN without any authentication.');
  console.warn(
    '------------------------NOTICE----------------------------------\n' +
      '* The analysts API are TOTALLY OPEN without any authentication,*\n' +
      '* Make sure the server runs on a closed network,               *\n' +
      '* Otherwise, anyone can manipulate data.                       *\n' +
      '----------------------------------------------------------------\n'
  );
}

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

  if (scopes.indexOf('analystsAuth') !== -1) {
    if (allowAnalystsAccess) {
      return;
    }
    throw new Error('Analysts API are closed');
  }

  if (scopes.indexOf('reporterAuth') !== -1) {
    const reporterKey = request.header('Authorization');
    if (await checkReporterKey(reporterKey)) {
      return;
    }
  }

  throw new Error('auth fail');
};
