import { db } from '../core/db';

export const createReporter = (reporterKey: string) =>
	db.one('INSERT INTO reporters(reporter_key) VALUES($1, $2) RETURNING id', [ reporterKey ]);

export const checkReporterKey = async (reporterKey: string): Promise<boolean> => {
	/** Get all records that reporterKey match *reporterKey* parameter. */
	const reporter = await db.any(`SELECT reporter_key FROM reporters WHERE reporter_key = $1`, [ reporterKey ]);
	/** If there is at least one match, it means the API key is valid. */
	return reporter.length > 0;
};
