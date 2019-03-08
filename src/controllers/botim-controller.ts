import * as express from 'express';
import { getBotIds } from '../data/confirmed';
import { createUserIds } from '../data/suspected';
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
import { Bots, Report, ConfirmedBot } from '../models/symbols';

const botsCache = new NodeCache({
	stdTTL: 60 * 60 * 2, // Each 2 hours reread bots from db.
	checkperiod: 60 * 30 // Clear cache every 30 minutes.
});

@Tags('Botim')
@Route('botim')
export class BotimController extends Controller {
	/**
     * Get all confirmed botim.
     */
	@Response(501, 'Server error')
	@Get('confirmed')
	public async getConfirmed(@Query() userIds: string[]): Promise<Bots> {
		// try fill bots from cache only.
		const cachedBots: Bots = {};
		let failToRetriveFromCache = false;
		for (const userId of userIds) {
			const cachedBot: ConfirmedBot | string = botsCache.get(userId);
			// If not all in cache, abort reread all from db.
			if (!cachedBot) {
				failToRetriveFromCache = true;
				break;
			}

			if (cachedBot !== 'empty') {
				cachedBots[userId] = cachedBot as ConfirmedBot;
			}
		}

		if (!failToRetriveFromCache) {
			return cachedBots;
		}

		// If cache not hold all bots yet, update cache for next time ;)
		const bots = await getBotIds(userIds);

		// Load cache.
		for (const [ userId, confirmedBot ] of Object.entries(bots)) {
			botsCache.set(userId, confirmedBot);
		}

		// Mark all users that not in bots as empty in cache for next time.
		for (const userId of userIds) {
			if (!(userId in bots)) {
				botsCache.set(userId, 'empty');
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
		await createUserIds(report);
	}
}
