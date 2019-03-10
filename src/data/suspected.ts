import { getConnection } from '../core/db';
import { Bot } from '../models/symbols';
import { getBotsOnlyMap } from './confirmed';
export const createNewReport = async (report: Bot) => {
  /** If the bot already reported, ignore the request. */
  const bots = await getBotsOnlyMap([report.userId], report.platform);
  if (report.userId in bots) {
    return;
  }

  report.detectionStatus = 'REPORTED';
  await getConnection().manager.save(new Bot(report));
};
