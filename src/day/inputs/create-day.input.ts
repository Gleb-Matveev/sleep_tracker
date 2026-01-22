import { Field, InputType } from "@nestjs/graphql";
import { IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

@InputType({description: "Input type for creating a day"})
export class CreateDayInput {
  @Field(() => Date, {description: 'Date'})
  @IsDate()
  date: Date;

  @Field(() => Number, {description: 'How easy was it to get up'})
  @IsNumber()
  getup_score: number;

  @Field(() => Number, {description: 'How well did you feel throughtout the day'})
  @IsNumber()
  feeling_score: number;

  @Field(() => String, {description: 'Wake up time'})
  @IsString()
  wakeUpTime: string;

  @Field(() => String, {description: 'Time you went to sleep'})
  @IsString()
  wakeDownTime: string;

  @Field(() => String, {description: 'Any additional info on the day'})
  @IsString()
  description: string;

  @Field(() => [Number], {description: 'Routines you completed this day'})
  @IsArray()
  routines: number[];
}