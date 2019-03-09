export declare type Platform = 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM';

export declare type BotReason = 'BOT' | 'VIOLENCE' | 'FAKE';

export declare type DetectionStatus = 'REPORTED' | 'IN_PROCESS' | 'BOT' | 'NOT_BOT';

/** 
 * Each schema that needs to authenticate the client before handling it should extend it.
 */
export interface AuthedRequest {
	authKey: string;
}

export interface Bot {
	detectionStatus: DetectionStatus;
	botReason: BotReason;
	platform: Platform;
}

export interface Report extends AuthedRequest {
	userId: string;
	description: string;
	platform: Platform;
	botReason: BotReason;
	commentId?: string;
	replayId?: string;
}

export interface Bots {
	/** Map 'Bot' by userId */
	[key: string]: Bot;
}
