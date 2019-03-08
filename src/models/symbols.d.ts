export declare type Platform = 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM';

export declare type BotReason = 'BOT' | 'VIOLENCE' | 'FAKE';

export declare type DetectionStatus = 'REPORTED' | 'IN_PROCESS' | 'BOT' | 'NOT_BOT';

/** 
 * Each schema that needs to authenticate the client before handling it should extend it.
 */
export interface AuthedRequest {
	authKey: string;
}

export interface Report extends AuthedRequest {
	platform: Platform;
	botReason: BotReason;
	userId: string;
	description: string;
}

export interface ConfirmedBot {
	detectionStatus: DetectionStatus;
	botReason: BotReason;
	platform: Platform;
}

export interface Bots {
	/** Map 'ConfirmedBot' by userId */
	[key: string]: ConfirmedBot;
}
