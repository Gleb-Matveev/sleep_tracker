import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Day } from './day.entity';
import { Routine } from '../../routine/entities/routine.entity';

@Entity('day_routines')
export class DayRoutine {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Day, day => day.routines, { 
    onDelete: 'CASCADE',
  })
  day: Day;

  @ManyToOne(() => Routine, routine => routine.days, { 
    onDelete: 'CASCADE',
  })
  routine: Routine;
}