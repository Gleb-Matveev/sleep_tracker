import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Day } from './day.entity';
import { Routine } from '../../routine/entities/routine.entity';

@Entity('day_routines')
export class DayRoutine {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Day)
  day: Day;

  @ManyToOne(() => Routine)
  routine: Routine;
}