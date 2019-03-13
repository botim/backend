import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { AuthenticatedRequest } from './authenticated-request.model';

import { Platform, Status, Reason } from '../core';

@Entity({ name: 'user_statuses' })
export class UserStatus extends AuthenticatedRequest {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ name: 'user_id', type: 'varchar', length: 30 })
  public userId: string;

  @Column({ type: 'varchar', length: 200 })
  public description: string;

  @Column({ type: 'enum', enum: Platform })
  public platform: Platform;

  // TODO: default not working when accessing the enum
  // TypeError: Cannot read property 'REPORTED' of undefined
  @Column({ type: 'enum', enum: Status })
  public status?: Status;

  @Column({ type: 'enum', enum: Reason, array: true })
  public reasons: Reason[];

  @Column({ name: 'comment_id', type: 'varchar', length: 30 })
  public commentId?: string;

  @Column({ name: 'replay_comment_id', type: 'varchar', length: 30 })
  public replyCommentId?: string;

  constructor(private userStatus?: Partial<UserStatus>) {
    super(userStatus);

    if (userStatus) {
      Object.assign(this, userStatus);
    }
  }
}
