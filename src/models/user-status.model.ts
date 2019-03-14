import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

import { AuthenticatedRequest } from './authenticated-request.model';

import { Platform, Status, Reason } from '../core';

@Entity({ name: 'user_statuses' })
@Unique(['userId', 'platform', 'postId', 'commentId', 'replayCommentId'])
export class UserStatus extends AuthenticatedRequest {
  @PrimaryGeneratedColumn() private id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 30, nullable: false })
  public userId: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  public description: string;

  @Column({ type: 'enum', enum: Platform, nullable: false })
  public platform: Platform;

  // TODO: default not working when accessing the enum
  // TypeError: Cannot read property 'REPORTED' of undefined
  @Column({ type: 'enum', enum: Status, nullable: false })
  public status?: Status;

  @Column({ type: 'enum', enum: Reason, array: true, nullable: false })
  public reasons: Reason[];

  @Column({ name: 'post_id', type: 'varchar', length: 30, nullable: true })
  public postId?: string;

  @Column({ name: 'comment_id', type: 'varchar', length: 30, nullable: true })
  public commentId?: string;

  @Column({ name: 'replay_comment_id', type: 'varchar', length: 30, nullable: true })
  public replayCommentId?: string;

  constructor(private userStatus?: Partial<UserStatus>) {
    super(userStatus);

    if (userStatus) {
      Object.assign(this, userStatus);
    }
  }
}
