import * as express from 'express';
import { getBotsByIds } from '../data/confirmed';
import { createNewReport } from '../data/suspected';
import * as NodeCache from 'node-cache';
import {
	Body,
	Controller,
	Query,
	Delete,
	Get,
	Header,
	Path,
	Post,
	Put,
	Request,
	Response,
	Route,
	Security,
	SuccessResponse,
	Tags
} from 'tsoa';
import { Bots, Report, Bot, Platform } from '../models/symbols';

const botsCache = new NodeCache({
	stdTTL: parseInt(process.env.CACHE_TTL || '3600'),
	checkperiod: parseInt(process.env.CACHE_CHECK_PERIOD || '1800')
});

@Tags('Bots')
@Route('bots')
export class BotimController extends Controller {
	/**
     * Get all confirmed bots.
     */
	@Response(501, 'Server error')
	@Get('confirmed')
	public async getConfirmed(@Query() userIds: string[], @Query() platform: Platform): Promise<Bots> {
		/** Try to retrieve bots from the cache before reading data from the DB. */

		const cachedBots: Bots = {};
		let failToRetriveFromCache = false;
		/** Iterate on userIds to look for cached data about him. */
		for (const userId of userIds) {
			const cachedBot: Bot | string = botsCache.get(`${platform}:${userId}`);
			/** If not *all* users cached, abort and retrieve all from db. */
			if (!cachedBot) {
				failToRetriveFromCache = true;
				break;
			}

			/** 
			 * If the user marked as 'NOT_EXIST' ignore it.
			 */
			if (cachedBot !== 'NOT_EXIST') {
				cachedBots[userId] = cachedBot as Bot;
			}
		}

		/** If all users cached, return the bots from the cache. */
		if (!failToRetriveFromCache) {
			return cachedBots;
		}

		/** If cache not hold all bots yet, update cache for next time ;) */
		const bots = await getBotsByIds(userIds, platform);

		/** Update cache. */
		for (const [ userId, confirmedBot ] of Object.entries(bots)) {
			botsCache.set(`${platform}:${userId}`, confirmedBot);
		}

		/** Mark all users that not in bots as 'NOT_EXIST' in the cache for next time. */
		for (const userId of userIds) {
			if (!(userId in bots)) {
				botsCache.set(`${platform}:${userId}`, 'NOT_EXIST');
			}
		}

		return bots;
	}

	/**
     * Report a bot.
     */
	@Response(501, 'Server error')
	@Security('reporterAuth')
	@Post('suspected')
	public async reportSuspected(@Body() report: Report): Promise<void> {
		await createNewReport(report);
	}
}
