import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'reporters' })
export class Reporter {
  @PrimaryGeneratedColumn()
  private id: number;

  @Column({ name: 'reporter_key', type: 'varchar', length: 30 })
  public reporterKey: string;
}
