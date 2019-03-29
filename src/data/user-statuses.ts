import { In, Not, getConnection } from 'typeorm';

import { UserStatusMap, Platform, Status } from '../core';
import { UserStatus, Pagination } from '../models';
import { ITEMS_PER_PAGE } from '../core/config';

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

/** Get reports page. */
export const getUserStatuses = async (
  page: number,
  showUnclassified?: boolean
): Promise<Pagination> => {
  const botRepository = getConnection().getRepository(UserStatus);
  const [reports, total] = await botRepository.findAndCount({
    take: ITEMS_PER_PAGE,
    skip: page * ITEMS_PER_PAGE,
    where: {
      status: showUnclassified
        ? In([Status.REPORTED, Status.IN_PROCESS])
        : Not(Status.DUPLICATE)
    },
    order: {
      reportedAt: 'DESC'
    }
  });

  return new Pagination(reports, total);
};

/** Get all reports of a user. */
export const getSpecificUserStatuses = async (
  platform: Platform,
  userId: string
): Promise<UserStatus[]> => {
  const botRepository = getConnection().getRepository(UserStatus);
  const userReports = await botRepository.find({
    order: {
      reportedAt: 'ASC'
    },
    where: {
      platform,
      userId
    }
  });

  return userReports;
};

/** Update user status */
export const updateUserStatus = async (platform: Platform, userId: string, status: Status) => {
  const botRepository = getConnection().getRepository(UserStatus);
  await botRepository.update({ userId, platform, status: Not(Status.DUPLICATE) }, { status });
};
