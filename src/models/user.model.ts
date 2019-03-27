import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn() private id: number;

  @Column({ type: 'varchar', length: 30, nullable: false })
  public username: string;

  /** Passwords should be encrypted using 'bcrypt' */
  @Column({ type: 'varchar', length: 128, nullable: false })
  public password: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  public email: string;

  constructor(private user?: Partial<User>) {
    if (user) {
      Object.assign(this, user);
    }
  }
}
