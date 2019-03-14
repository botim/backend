import { configure, getLogger } from 'log4js';

/** Use the simplest configuration. */
configure({
  appenders: { default: { type: 'console' } },
  categories: { default: { appenders: ['default'], level: 'debug' } }
});

export const logger = getLogger();
