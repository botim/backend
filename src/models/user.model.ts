import * as bcrypt from 'bcrypt';

import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn() private id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  public username: string;

  @Column({ type: 'varchar', length: 128, nullable: false, select: false })
  public password: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  public email: string;

  constructor(private user?: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }

  @BeforeInsert()
  beforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
