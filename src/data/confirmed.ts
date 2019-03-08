import { db } from '../core/db';
import { Bots, Report, DetectionStatus } from '../models/symbols';

export const getBotsByIds = async (userIds: string[]): Promise<Bots> => {
	/** Gets all bots that mention in userIds array */
	const botsArray = await db.any(`SELECT * FROM confirmedBots WHERE userid IN ($1:list)`, [ userIds ]);

	/** Convert array to bots object mapped by userId */
	const botsMap: Bots = {};
	for (const bot of botsArray) {
		botsMap[bot.userid] = {
			botReason: bot.botreason,
			detectionStatus: bot.detectionstatus,
			platform: bot.platform
		};
	}

	return botsMap;
};
