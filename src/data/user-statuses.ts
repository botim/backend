import { In, Not, getConnection, FindOperator, Equal, Any } from 'typeorm';

import { UserStatusMap, Platform, Status, ObjectKeyMap } from '../core';
import { UserStatus, Pagination, ActivityLog } from '../models';
import { PAGINATION_ITEMS_PER_PAGE } from '../core/config';
import { saveActivity } from './activity-log';

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
  page: number = 0,
  order: string = 'reportedAt',
  sort: 'ASC' | 'DESC' = 'ASC',
  filters: ObjectKeyMap = {},
  showUnclassified?: boolean
): Promise<Pagination> => {
  const where: ObjectKeyMap<FindOperator<any>> = {
    status: showUnclassified ? In([Status.REPORTED, Status.IN_PROCESS]) : Not(Status.DUPLICATE)
  };

  if (filters) {
    for (const field in filters) {
      if (filters.hasOwnProperty(field) && filters[field]) {
        where[field] = Equal(filters[field]);
      }
    }
  }

  const botRepository = getConnection().getRepository(UserStatus);
  const [items, total] = await botRepository.findAndCount({
    take: PAGINATION_ITEMS_PER_PAGE,
    skip: page * PAGINATION_ITEMS_PER_PAGE,
    where,
    order: {
      [order]: sort
    }
  });

  return new Pagination(items, total);
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
export const updateUserStatus = async (
  id: number,
  status: Status,
  adminId: number
): Promise<UserStatus> => {
  const botRepository = getConnection().getRepository(UserStatus);
  const userStatus = await botRepository.findOne(id);
  await botRepository.update(id, { status });

  await saveActivity({
    userStatusId: userStatus.id,
    oldStatus: userStatus.status,
    newStatus: status,
    adminId
  });

  return userStatus;
};
