import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import bcrypt from 'bcrypt';

@Entity()
export class User {
  @PrimaryColumn({ type: 'varchar', name: 'email' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @BeforeInsert()
  async setPassword(password: string) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
