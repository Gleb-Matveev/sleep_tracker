import { Field, ID, InputType } from "@nestjs/graphql";
import { RoutinePeriod } from "../entities/routine.entity";
import { DayModel } from "src/day/models/day.model";
import { IsArray, IsEnum, IsNumber, IsString } from "class-validator";

@InputType({description: "Input type for creating routine"})
export class CreateRoutineInput {
  @Field({description: 'Name of the routine'})
  @IsString()
  name: string;

  @Field(() => RoutinePeriod, {description: "Period of the routine: day or night"})
  @IsEnum(RoutinePeriod)
  period: RoutinePeriod;

  @Field(() => [String], {description: "Particular steps of the routine"})
  @IsArray()
  steps: string[];
}