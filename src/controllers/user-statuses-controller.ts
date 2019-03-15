import {
  Body,
  Controller,
  Query,
  Get,
  Post,
  Response,
  Route,
  Security,
  Tags,
  Header
} from 'tsoa';

import { getUserStatusMap, createNewReport } from '../data';
import { Platform, UserStatusMap, Cache } from '../core';
import { UserStatus } from '../models';

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
  @Security('reporterAuth')
  @Post('report')
  public async report(
    @Body() report: UserStatus,
    @Header('Authorization') reporterKey: string
  ): Promise<void> {
    await createNewReport(report, reporterKey);
  }
}
