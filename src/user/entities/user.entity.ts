import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Day } from '../../day/entities/day.entity';
import { Routine } from '../../routine/entities/routine.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Rule } from '../../rule/entities/rule.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Day, day => day.user)
  days: Day[];

  @OneToMany(() => Routine, routine => routine.user)
  routines: Routine[];

  @OneToMany(() => Goal, goal => goal.user)
  goals: Goal[];

  @OneToMany(() => Rule, rule => rule.user)
  rules: Rule[];
}
