import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { DayRoutine } from '../../day/entities/day-routine.entity';
import { User } from '../../user/entities/user.entity';
import { registerEnumType } from '@nestjs/graphql';

export enum RoutinePeriod {
  DAY = 'Day',
  NIGHT = 'Night',
}

@Entity('routine')
export class Routine {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: RoutinePeriod })
  period: RoutinePeriod;

  @Column("text", { array: true, default: [] })
  steps: string[];

  @OneToMany(() => DayRoutine, dr => dr.routine)
  days: DayRoutine[];

  @Column()
  userId: number;
  
  @ManyToOne(() => User, user => user.routines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}