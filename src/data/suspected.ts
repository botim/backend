import { db } from '../core/db';
import { Report, DetectionStatus } from '../models/symbols';
import { getBotsByIds } from './confirmed';
export const createNewReport = async (report: Report) => {
	/** If bot already reported, ignore request. */
	const bots = await getBotsByIds([ report.userId ], report.platform);
	if (report.userId in bots) {
		return;
	}

	const detectionStatus: DetectionStatus = 'REPORTED';

	/** Create a new report record */
	await db.one(
		'INSERT INTO botim(user_id, comment_id, replay_id, platform, bot_reason, detection_status, description, reporter_key)' +
			'VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
		[
			report.userId,
			report.commentId || '',
			report.replayId || '',
			report.platform,
			report.botReason,
			detectionStatus,
			report.description,
			report.authKey
		]
	);
};
