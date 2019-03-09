import { db } from '../core/db';
import { Bots, Report, DetectionStatus, Platform } from '../models/symbols';

export const getBotsByIds = async (userIds: string[], platform: Platform): Promise<Bots> => {
	/** Gets all bots that mention in userIds array */
	const botsArray = await db.any(`SELECT * FROM botim WHERE user_id IN ($1:list) AND platform = $2`, [
		userIds,
		platform
	]);

	/** Convert array to bots object mapped by userId */
	const botsMap: Bots = {};
	for (const bot of botsArray) {
		botsMap[bot.user_id] = {
			botReason: bot.bot_reason,
			detectionStatus: bot.detection_status,
			platform: bot.platform
		};
	}

	return botsMap;
};
