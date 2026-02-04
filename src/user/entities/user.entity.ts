import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Day } from '../../day/entities/day.entity';
import { Routine } from '../../routine/entities/routine.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Rule } from '../../rule/entities/rule.entity';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  supertoken_id: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Day, day => day.user)
  days: Day[];

  @OneToMany(() => Routine, routine => routine.user)
  routines: Routine[];

  @OneToMany(() => Goal, goal => goal.user)
  goals: Goal[];

  @OneToMany(() => Rule, rule => rule.user)
  rules: Rule[];
}
