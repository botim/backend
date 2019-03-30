import {
  Body,
  Controller,
  Query,
  Get,
  Post,
  Request,
  Response,
  Route,
  Security,
  Tags,
  Header,
  Put
} from 'tsoa';
import * as express from 'express';

import {
  getUserStatusMap,
  createNewReport,
  getUserStatuses,
  getSpecificUserStatuses,
  updateUserStatus
} from '../data';
import { Platform, UserStatusMap, Cache, UserUpdate } from '../core';
import { UserStatus, Pagination } from '../models';

const usersCache = new Cache(
  +process.env.USERS_CACHE_TTL || 1,
  +process.env.USERS_CACHE_CHECK_PERIOD || 0
);

@Tags('UserStatuses')
@Route('/')
export class UserStatusesController extends Controller {
  /**
   * Return the user statuses of the supplied user ids.
   */
  @Response(501, 'Server error')
  @Get('check')
  public async check(
    @Query() userIds: string[],
    @Query() platform: Platform
  ): Promise<UserStatusMap> {
    /** Try to retrieve users status from the cache before reading data from the DB. */
    const usersStatusMap: UserStatusMap = {};
    for (const userId of userIds) {
      const cacheResult = await usersCache.get(`${platform}:${userId}`);
      if (!cacheResult) {
        break;
      }
      usersStatusMap[userId] = cacheResult;
    }

    /** If found cache result for all users, return cache map only. */
    if (Object.keys(usersStatusMap).length === userIds.length) {
      return usersStatusMap;
    }

    const currentUsersStatus = await getUserStatusMap(userIds, platform);

    /** Hold all user current status in the cache for next time ;) */
    for (const [userId, currentStatus] of Object.entries(currentUsersStatus)) {
      await usersCache.set(`${platform}:${userId}`, currentStatus);
    }

    return currentUsersStatus;
  }

  /**
   * Report a user.
   */
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Security('REPORTER')
  @Post('report')
  public async report(
    @Body() report: UserStatus,
    @Header('Authorization') reporterKey: string
  ): Promise<void> {
    await createNewReport(report, reporterKey);
  }

  /**
   * Get all reports as an array, page by page.
   * @param page Page index.
   */
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Security('ADMIN')
  @Get('statuses')
  public async getUserStatuses(
    @Query() page: number,
    @Query() order: string,
    @Query() sort: 'ASC' | 'DESC',
    // TODO: use typings for filters, tsoa shows an error
    @Request() request: express.Request
  ): Promise<Pagination> {
    const { status, platform } = request.query;

    return await getUserStatuses(page, order, sort, { status, platform });
  }

  /**
   * Get reported user reports. (Original report and all duplicates).
   * @param platform Reported user platform.
   * @param userId Reported user id.
   */
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Security('ADMIN')
  @Get('statuses/{platform}/{userId}')
  public async getUserReports(platform: Platform, userId: string): Promise<UserStatus[]> {
    return await getSpecificUserStatuses(platform, userId);
  }

  /**
   * Set bot status.
   * @param platform Suspected bot platform.
   * @param userId Suspected bot id, to update status for.
   * @param userUpdate The new status to set.
   */
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Security('ADMIN')
  @Put('statuses/{platform}/{userId}')
  public async updateUser(
    platform: Platform,
    userId: string,
    @Body() userUpdate: UserUpdate,
    @Request() request: express.Request
  ): Promise<void> {
    await updateUserStatus(request.user, platform, userId, userUpdate.setStatus);
  }
}
