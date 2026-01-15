import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from "../entities/goal.entity";

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Status)
  status: Status;
}
