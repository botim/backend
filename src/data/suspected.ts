import { db } from '../core/db';

export const createUserIds = (userId: string, isBot: boolean) =>
	db.one('INSERT INTO suspectedBots(userId, isBot) VALUES($1, $2) RETURNING id', [ userId, isBot ]);
