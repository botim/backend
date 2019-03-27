import { In, Not, getConnection } from 'typeorm';

import { UserStatusMap, Platform, Status } from '../core';
import { UserStatus } from '../models';

/** Get detection status for reported users only. */
export const getUserStatusOnlyMap = async (
  userIds: string[],
  platform: Platform
): Promise<UserStatusMap> => {
  /** Gets all user statuses in current platform that mention in userIds array */
  const userStatusRepository = getConnection().getRepository(UserStatus);
  const userStatuses = await userStatusRepository.find({
    where: { platform, userId: In(userIds), status: Not(Status.DUPLICATE) }
  });

  const userStatusMap: UserStatusMap = {};

  for (const { userId, status } of userStatuses) {
    userStatusMap[userId] = status;
  }

  return userStatusMap;
};

/**
 * Get all users detection status map, and in case of the user not even reported set status as 'NOT_BOT'.
 */
export const getUserStatusMap = async (
  userIds: string[],
  platform: Platform
): Promise<UserStatusMap> => {
  /** Gets all user statuses that mention in userIds array */
  const userStatusesOnlyMap = await getUserStatusOnlyMap(userIds, platform);

  const userStatusMap: UserStatusMap = {};

  for (const userId of userIds) {
    userStatusMap[userId] = Status.NOT_BOT;
  }

  for (const [userId, status] of Object.entries(userStatusesOnlyMap)) {
    userStatusMap[userId] = status;
  }

  return userStatusMap;
};

/** Get all bots in system. */
export const getUsers = async (): Promise<UserStatus[]> => {
  const botRepository = getConnection().getRepository(UserStatus);
  return await botRepository.find();
};

/** Update user status */
export const updateUserStatus = async (
  platform: Platform,
  userId: string,
  setStatus: Status
) => {
  const botRepository = getConnection().getRepository(UserStatus);
  await botRepository.update(
    { userId, platform, status: Not(Status.DUPLICATE) },
    { status: setStatus }
  );
};
