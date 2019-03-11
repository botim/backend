import { getConnection, Status } from '../core';
import { Bot } from '../models';

import { getBotsOnlyMap } from './confirmed';

export const createNewReport = async (report: Bot) => {
  /** If the bot already reported, ignore the request. */
  const bots = await getBotsOnlyMap([report.userId], report.platform);

  if (report.userId in bots) {
    return;
  }

  const bot = new Bot({ ...report, status: Status.REPORTED });

  await getConnection().manager.save(bot);
};
