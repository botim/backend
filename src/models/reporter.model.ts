import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Platform } from '../core';

@Entity({ name: 'reporters' })
export class Reporter {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ type: 'enum', enum: Platform })
  public platform: Platform;

  @Column({ name: 'user_id', type: 'varchar', length: 30 })
  public userId: string;

  @Column({ name: 'reporter_key', type: 'varchar', length: 30 })
  public reporterKey: string;
}
