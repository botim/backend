import { In } from 'typeorm';

import { getConnection, BotMap, Platform, Status } from '../core';
import { Bot } from '../models';

/** Get detection status for reported users only. */
export const getBotsOnlyMap = async (
  userIds: string[],
  platform: Platform
): Promise<BotMap> => {
  /** Gets all bots in current platform that mention in userIds array */
  const botRepository = getConnection().getRepository(Bot);
  const bots = await botRepository.find({ where: { platform, userId: In(userIds) } });

  const botMap: BotMap = {};

  for (const { userId, status } of bots) {
    botMap[userId] = status;
  }

  return botMap;
};

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
    botMap[userId] = Status.NOT_BOT;
  }

  for (const [userId, status] of Object.entries(botsOnlyMap)) {
    botMap[userId] = status;
  }

  return botMap;
};
