import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { DayRoutine  } from './day-routine.entity';
import { User } from '../../user/entities/user.entity';

@Entity('day')
export class Day {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  getup_score: number;

  @Column()
  feeling_score: number;

  @Column({ type: 'time' })
  wakeUpTime: string;

  @Column({ type: 'time' })
  wakeDownTime: string;

  @Column()
  description: string;

  @OneToMany(() => DayRoutine, dr => dr.day, { 
    cascade: true,
    orphanedRowAction: 'delete',
    eager: true
  })
  routines: DayRoutine[];

  @ManyToOne(() => User, user => user.days)
  user: User;
}