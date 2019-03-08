import { db } from '../core/db';
import { Bots, Report, DetectionStatus } from '../models/symbols';

export const getBotIds = async (userIds: string[]): Promise<Bots> => {
	const bots = await db.any(`SELECT * FROM confirmedBots WHERE userid IN ($1:list)`, [ userIds ]);

	const botsAsMap: Bots = {};
	for (const bot of bots) {
		botsAsMap[bot.userid] = {
			botReason: bot.botreason,
			detectionStatus: bot.detectionstatus,
			platform: bot.platform,
		};
	}

	return botsAsMap;
};
