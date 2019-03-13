import { Body, Controller, Query, Get, Post, Response, Route, Security, Tags } from 'tsoa';

import { getUserStatusMap, createNewReport } from '../data';
import { Platform, UserStatusMap } from '../core';
import { UserStatus } from '../models';

// const botsCache = new NodeCache({
//   stdTTL: +process.env.CACHE_TTL || 3600,
//   checkperiod: +process.env.CACHE_CHECK_PERIOD || 1800
// });

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
    // /** Try to retrieve bots from the cache before reading data from the DB. */
    // const cachedBots: Bots = {};
    // let failToRetrieveFromCache = false;
    // /** Iterate on userIds to look for cached data about him. */
    // for (const userId of userIds) {
    //   const cachedBot: Bot | string = botsCache.get(`${platform}:${userId}`);
    //   /** If not *all* users cached, abort and retrieve all from db. */
    //   if (!cachedBot) {
    //     failToRetrieveFromCache = true;
    //     break;
    //   }

    //   /**
    //    * If the user marked as 'NOT_EXIST' ignore it.
    //    */
    //   if (cachedBot !== 'NOT_EXIST') {
    //     cachedBots[userId] = cachedBot as Bot;
    //   }
    // }

    // /** If all users cached, return the bots from the cache. */
    // if (!failToRetrieveFromCache) {
    //   return cachedBots;
    // }

    /** If cache not hold all user statuses yet, update cache for next time ;) */
    const userStatuses = await getUserStatusMap(userIds, platform);

    // /** Update cache. */
    // for (const [userId, confirmedBot] of Object.entries(bots)) {
    //   botsCache.set(`${platform}:${userId}`, confirmedBot);
    // }

    // /** Mark all users that not in bots as 'NOT_EXIST' in the cache for next time. */
    // for (const userId of userIds) {
    //   if (!(userId in bots)) {
    //     botsCache.set(`${platform}:${userId}`, 'NOT_EXIST');
    //   }
    // }

    return userStatuses;
  }

  /**
   * Report a user.
   */
  @Response(501, 'Server error')
  @Response(401, 'Authentication fail')
  @Security('reporterAuth')
  @Post('report')
  public async report(@Body() report: UserStatus): Promise<void> {
    await createNewReport(report);
  }
}
