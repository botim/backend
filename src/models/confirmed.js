import { db } from './db';

exports.getBotIds = () => db.any('SELECT userId FROM suspectedbots WHERE isBot=true', [true]);
