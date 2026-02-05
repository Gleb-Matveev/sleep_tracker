import { Field, ID, ObjectType, registerEnumType } from "@nestjs/graphql";
import { RoutinePeriod } from "../entities/routine.entity";
import { DayModel } from '../../day/models/day.model';

registerEnumType(RoutinePeriod, {
  name: 'RoutinePeriod',
  description: 'Day or night',
});

@ObjectType({description: "Routine"})
export class RoutineModel {
  @Field(() => ID, {nullable: true, description: 'Unique identifier for the routine'})
  id: number;

  @Field({ description: 'Name of the routine' })
  name: string;

  @Field(() => RoutinePeriod, {description: "Period of the routine: day or night"})
  period: RoutinePeriod;

  @Field(() => [String], {description: "Particular steps of the routine"})
  steps: string[];
}