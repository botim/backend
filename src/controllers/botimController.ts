import * as express from 'express';
import { getBotIds } from '../data/confirmed';
import { createUserIds } from '../data/suspected';

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
import { BotMeta, Report } from '../models/symbols';

@Tags('Botim')
@Route('botim')
export class BotimController extends Controller {
	/**
     * Get all confirmed botim.
     */
	@Response(501, 'Server error')
	@Get('confirmed')
	public async getConfirmed(): Promise<BotMeta[]> {
		return await getBotIds();
	}

	/**
     * Report a bot.
     */
	@Response(501, 'Server error')
	@Post('suspected')
	public async reportSuspected(@Body() report: Report): Promise<void> {
		await createUserIds(report.userId, true);
	}
}
