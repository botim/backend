import { db } from '../core/db';
import { Report } from '../models/symbols';

export const createNewReport = (report: Report) => {
	/** Create a new report record */
	db.one(
		'INSERT INTO suspectedBots(userId, platform, botReason, description, reporterKey)' +
			'VALUES($1, $2, $3, $4, $5) RETURNING id',
		[ report.userId, report.platform, report.botReason, report.description, report.reporterKey ]
	);
};
