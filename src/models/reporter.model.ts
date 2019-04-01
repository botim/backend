import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Platform } from '../core';

@Entity({ name: 'reporters' })
export class Reporter {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ type: 'enum', enum: Platform })
  public platform: Platform;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  public userId: string;

  @Column({ name: 'reporter_key', type: 'varchar', length: 30, nullable: false })
  public reporterKey: string;
}
