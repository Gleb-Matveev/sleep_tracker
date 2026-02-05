import { Injectable } from "@nestjs/common";
import { CreateRoutineDto } from "./dto/create-routine.dto";
import { UpdateRoutineDto } from "./dto/update-routine.dto";
import { Routine } from "./entities/routine.entity";
import { CreateRoutineInput } from "./inputs/routine-create.input";
import { UpdateRoutineInput } from "./inputs/routine-update.input";
import { RoutineModel } from "./models/routine.model";
import { RoutineResponseDto } from "./dto/routine-response.dto";

@Injectable()
export class RoutineAdapter {
    toModel(routine: Routine): RoutineModel {
        return {
              id: routine.id,
              name: routine.name,
              period: routine.period,
              steps: routine.steps,
        }
    }

    toCreateDto(createRoutineInput: CreateRoutineInput): CreateRoutineDto {
        return {
              name: createRoutineInput.name,
              period: createRoutineInput.period,
              steps: createRoutineInput.steps,
        };
    }

    toUpdateDto(updateRoutineInput: UpdateRoutineInput): UpdateRoutineDto {
        return {
            name: updateRoutineInput.name,
            period: updateRoutineInput.period,
            steps: updateRoutineInput.steps,
        }
    }

    toRoutineResponseDto(routine: Routine): RoutineResponseDto {
        const routineDto = new RoutineResponseDto();
        routineDto.id = routine.id;
        routineDto.name = routine.name;
        routineDto.period = routine.period;
        routineDto.steps = routine.steps;
        return routineDto;
    }
}