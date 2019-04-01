import * as bcrypt from 'bcrypt';

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from 'typeorm';

import { ActivityLog } from './activity-log.model';
import { Scope } from '../core';

@Entity({ name: 'admins' })
export class Admin {
  @PrimaryGeneratedColumn() public id?: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  public username: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  public password: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  public email: string;

  @Column({ type: 'enum', enum: Scope, nullable: false })
  public scope: Scope;

  @OneToMany(() => ActivityLog, activityLog => activityLog.admin)
  public activityLogs: ActivityLog[];

  constructor(private admin?: Partial<Admin>) {
    if (admin) {
      Object.assign(this, admin);
    }
  }

  @BeforeInsert()
  beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
