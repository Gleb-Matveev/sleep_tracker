import { RoutinePeriod } from "../entities/routine.entity";

export class CreateRoutineDto {
  name: string;
  period: RoutinePeriod;
  steps: string[];
}
