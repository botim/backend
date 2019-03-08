import { db } from '../core/db';
import { Report } from '../models/symbols';

export const createUserIds = (report: Report) =>
	db.one(
		'INSERT INTO suspectedBots(userId, platform, botReason, description, reporterKey)' +
			'VALUES($1, $2, $3, $4, $5) RETURNING id',
		[ report.userId, report.platform, report.botReason, report.description, report.reporterKey ]
	);
