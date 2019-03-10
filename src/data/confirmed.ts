import { getConnection } from '../core/db';
import { BotMap, Platform } from '../models/symbols';
import { Bot } from '../models/symbols';
import { In } from 'typeorm';

/**
 * Get all users detection status map, and in case of the user not even reported set status as 'NOT_BOT'.
 */
export const getUsersBotsMap = async (
  userIds: string[],
  platform: Platform
): Promise<BotMap> => {
  /** Gets all bots that mention in userIds array */
  const botsOnlyMap = await getBotsOnlyMap(userIds, platform);

  const botMap: BotMap = {};

  for (const userId of userIds) {
    botMap[userId] = 'NOT_BOT';
  }

  for (const [userId, detectionStatus] of Object.entries(botsOnlyMap)) {
    botMap[userId] = detectionStatus;
  }

  return botMap;
};

/** Get detection status for reported users only. */
export const getBotsOnlyMap = async (
  userIds: string[],
  platform: Platform
): Promise<BotMap> => {
  /** Gets all bots in current platform that mention in userIds array */
  const botRepository = getConnection().getRepository(Bot);
  const bots = await botRepository.find({ where: { platform, userId: In(userIds) } });

  const botMap: BotMap = {};

  for (const bot of bots) {
    botMap[bot.userId] = bot.detectionStatus;
  }

  return botMap;
};
