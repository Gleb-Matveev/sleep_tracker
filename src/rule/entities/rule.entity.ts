import { User } from '../../user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity('rule')
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  userId: number;

  @ManyToOne(() => User, user => user.rules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}