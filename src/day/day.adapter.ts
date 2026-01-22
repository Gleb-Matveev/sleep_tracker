import { Injectable } from '@nestjs/common';
import { Day } from './entities/day.entity';
import { DayModel } from './models/day.model';
import { CreateDayInput } from './inputs/create-day.input';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { UpdateDayInput } from './inputs/update-day.input';
import { RoutineAdapter } from 'src/routine/routine.adapter';
import { Routine } from 'src/routine/entities/routine.entity';
import { RoutineModel } from 'src/routine/models/routine.model';

@Injectable()
export class DayAdapter {
  toModel(day: Day): DayModel {
    return {
      id: day.id,
      date: day.date,
      getup_score: day.getup_score,
      feeling_score: day.feeling_score,
      wakeUpTime: day.wakeUpTime,
      wakeDownTime: day.wakeDownTime,
      description: day.description,
      routines:
        day.routines?.map((dayRoutine) =>
          this.toRoutineModel(dayRoutine.routine),
        ) ?? [],
    };
  }

  toCreateDto(createDayInput: CreateDayInput): CreateDayDto {
    return {
      date: createDayInput.date.toDateString(),
      getup_score: createDayInput.getup_score,
      feeling_score: createDayInput.feeling_score,
      wakeUpTime: createDayInput.wakeUpTime,
      wakeDownTime: createDayInput.wakeDownTime,
      description: createDayInput.description,
      routineIds: createDayInput.routines,
    };
  }

  toUpdateDto(updateDayInput: UpdateDayInput): UpdateDayDto {
    return {
      date: updateDayInput.date?.toDateString(),
      getup_score: updateDayInput.getup_score,
      feeling_score: updateDayInput.feeling_score,
      wakeUpTime: updateDayInput.wakeUpTime,
      wakeDownTime: updateDayInput.wakeDownTime,
      description: updateDayInput.description,
      routineIds: updateDayInput.routines,
    };
  }

  toRoutineModel(routine: Routine): RoutineModel {
    return {
      id: routine.id,
      name: routine.name,
      period: routine.period,
      steps: routine.steps,
    };
  }
}
