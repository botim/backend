import { db } from '../core/db';
import { BotMap, Platform } from '../models/symbols';

export const getBotsByIds = async (userIds: string[], platform: Platform): Promise<BotMap> => {
  /** Gets all bots that mention in userIds array */
  const bots = await db.any(
    `SELECT * FROM botim WHERE user_id IN ($1:list) AND platform = $2`,
    [userIds, platform]
  );

  const botMap: BotMap = {};

  for (const userId of userIds) {
    botMap[userId] = 'NOT_BOT';
  }

  for (const bot of bots) {
    botMap[bot.user_id] = bot.detection_status;
  }

  return botMap;
};
