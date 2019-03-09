export declare type Platform = 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM';

export declare type BotReason = 'BOT' | 'VIOLENCE' | 'FAKE';

export declare type DetectionStatus = 'REPORTED' | 'IN_PROCESS' | 'BOT' | 'NOT_BOT';

export declare interface Report {
    platform : Platform;
    botReason : BotReason;
    userId: string;
}

export declare interface BotMeta {
    detectionStatus : DetectionStatus;
    platfrom : Platform;
    /** id of post, tweet, etc. */
    postId : string;
    botReason : BotReason;
}
