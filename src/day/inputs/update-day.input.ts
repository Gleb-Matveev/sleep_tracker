import { Field, InputType } from "@nestjs/graphql";
import { IsDate, IsDateString, IsOptional } from "class-validator";

@InputType({description: "Input type for updating a day"})
export class UpdateDayInput {
  @Field(() => Date, {
    nullable: true,
    description: 'Date',
  })
  @IsDate()
  @IsOptional()
  date: Date;

  @Field(() => Number, {
    nullable: true,
    description: 'How easy was it to get up',
  })
  @IsOptional()
  getup_score: number;

  @Field(() => Number, {
    nullable: true,
    description: 'How well did you feel throughtout the day'
  })
  @IsOptional()
  feeling_score: number;

  @Field(() => String, {
    nullable: true,
    description: 'Wake up time',
  })
  @IsOptional()
  wakeUpTime: string;

  @Field(() => String, {
    nullable: true,
    description: 'Time you went to sleep',
  })
  @IsOptional()
  wakeDownTime: string;

  @Field(() => String, {
    nullable: true,
    description: 'Any additional info on the day',
  })
  @IsOptional()
  description: string;

  @Field(() => [Number], {
    nullable: true,
    description: 'Routines you completed this day',
  })
  @IsOptional()
  routines: number[];
}