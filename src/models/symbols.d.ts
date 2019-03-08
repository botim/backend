export declare type Platform = 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM';

export declare type BotReason = 'BOT' | 'VIOLENCE' | 'FAKE';

export declare type DetectionStatus = 'REPORTED' | 'IN_PROCESS' | 'BOT' | 'NOT_BOT';

export interface AuthedRequest {
	reporterKey: string;
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
	[key: string]: ConfirmedBot;
}
