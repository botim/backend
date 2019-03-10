import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export declare type Platform = 'TWITTER' | 'FACEBOOK' | 'INSTAGRAM';

export declare type BotReason = 'BOT' | 'VIOLENCE' | 'FAKE';

export declare type DetectionStatus = 'REPORTED' | 'IN_PROCESS' | 'BOT' | 'NOT_BOT';

/**
 * Each schema that needs to authenticate the client before handling it should extend it.
 */
@Entity()
export class AuthedRequest {
  @Column({ name: 'reporter_key', type: 'varchar', length: 30 })
  authKey: string;

  constructor(private authedRequest: AuthedRequest = undefined) {
    if (!authedRequest) {
      return;
    }

    this.authKey = authedRequest.authKey;
  }
}

@Entity({ name: 'botim' })
export class Bot extends AuthedRequest {
  @PrimaryGeneratedColumn({ name: 'id' })
  private botPrimaryId: number;

  @Column({ name: 'user_id', type: 'varchar', length: 30 })
  public userId: string;

  @Column({ name: 'description', type: 'varchar', length: 200 })
  public description: string;

  @Column({ name: 'platform', type: 'varchar', length: 30 })
  public platform: Platform;

  @Column({ name: 'detection_status', type: 'varchar', length: 30 })
  public detectionStatus?: DetectionStatus;

  @Column({ name: 'bot_reason', type: 'varchar', length: 30 })
  public botReason: BotReason;

  @Column({ name: 'comment_id', type: 'varchar', length: 30 })
  public commentId?: string;

  @Column({ name: 'replay_id', type: 'varchar', length: 30 })
  public replayId?: string;

  constructor(private bot: Bot = undefined) {
    super(bot);

    if (!bot) {
      return;
    }

    this.userId = bot.userId;
    this.description = bot.description;
    this.platform = bot.platform;
    this.detectionStatus = bot.detectionStatus;
    this.botReason = bot.botReason;
    this.commentId = bot.commentId;
    this.replayId = bot.replayId;
  }
}

@Entity({ name: 'reporters' })
export class Reporter {
  @PrimaryGeneratedColumn({ name: 'id' })
  private reporterPrimaryId: number;

  @Column({ name: 'reporter_key', type: 'varchar', length: 30 })
  public reporterKey: string;
}

export interface BotMap {
  [key: string]: DetectionStatus;
}
