import { db } from '../core/db';

export const getBotIds = () => db.any('SELECT userId FROM suspectedbots WHERE isBot=true', [true]);
