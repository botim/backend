import { db } from '../core/db';

export const createReporter = (reporterKey: string) =>
	db.one('INSERT INTO reporters(reporterKey) VALUES($1, $2) RETURNING id', [ reporterKey ]);

export const getReporter = async (reporterKey: string): Promise<boolean> => {
	const reporter = await db.any(`SELECT reporterKey FROM reporters WHERE reporterKey = $1`, [ reporterKey ]);
	return reporter.length > 0;
};
