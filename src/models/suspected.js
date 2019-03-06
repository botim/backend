import { db } from './db';

exports.createUserIds = (userId, isBot) =>
  db.one('INSERT INTO suspectedBots(userId, isBot) VALUES($1, $2) RETURNING id', [
    userId,
    isBot
  ]);
