import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';

import { Status } from '../core';
import { Admin } from './admin.model';
import { UserStatus } from './user-status.model';

@Entity({ name: 'activity_log' })
export class ActivityLog {
  @PrimaryGeneratedColumn() public id?: number;

  @Column({ name: 'user_status_id', type: 'int', nullable: true })
  public userStatusId: number;

  @ManyToOne(() => UserStatus, userStatus => userStatus.activityLogs)
  public userStatus?: UserStatus;

  @Column({ name: 'old_status', type: 'enum', enum: Status, nullable: true })
  public oldStatus: Status;

  @Column({ name: 'new_status', type: 'enum', enum: Status, nullable: false })
  public newStatus: Status;

  @Column({ name: 'admin_id', type: 'int', nullable: true })
  public adminId: number;

  @ManyToOne(() => Admin, admin => admin.activityLogs)
  public admin?: Admin;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  public createdAt: Date;

  constructor(private activityLog?: Partial<ActivityLog>) {
    if (activityLog) {
      Object.assign(this, activityLog);
    }
  }
}
