import { IsString, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
import { RoutinePeriod } from "../entities/routine.entity";

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RoutinePeriod)
  period: RoutinePeriod;

  @IsArray()
  @IsString({ each: true })
  steps: string[];
}
