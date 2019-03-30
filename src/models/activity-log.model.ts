import { Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn } from 'typeorm';

import { Platform, Status, Reason } from '../core';

@Entity({ name: 'activity_log' })
export class ActivityLog {
  @PrimaryGeneratedColumn() private id: number;

  @Column({ name: 'reported_by', type: 'varchar', length: 30, nullable: true })
  public reportedBy?: string;

  @Column({ name: 'analyzed_by', type: 'varchar', length: 30, nullable: true })
  public analyzedBy?: string;

  @Column({ name: 'user_platform', type: 'enum', enum: Platform, nullable: false })
  public userPlatform: Platform;

  @Column({ name: 'user_id', type: 'varchar', length: 30, nullable: false })
  public userId: string;

  @Column({ type: 'enum', enum: Status, nullable: false })
  public action: Status;

  @CreateDateColumn({ nullable: false })
  public timestamp: Date;

  constructor(private activityLog?: Partial<ActivityLog>) {
    if (activityLog) {
      Object.assign(this, activityLog);
    }
  }
}
