import { Field, ID, InputType } from "@nestjs/graphql";
import { RoutinePeriod } from "../entities/routine.entity";
import { DayModel } from "src/day/models/day.model";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

@InputType({description: "Input type for updating routine"})
export class UpdateRoutineInput {
  @Field({description: 'Name of the routine'})
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => RoutinePeriod, {description: "Period of the routine: day or night"})
  @IsEnum(RoutinePeriod)
  @IsOptional()
  period: RoutinePeriod;

  @Field(() => [String], {description: "Particular steps of the routine"})
  @IsArray()
  @IsOptional()
  steps: string[];
}