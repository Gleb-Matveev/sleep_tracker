import { Status } from "../entities/goal.entity";
export class CreateGoalDto {
  name: string;
  description: string;
  status: Status;
}
