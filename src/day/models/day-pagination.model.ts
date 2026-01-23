import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DayModel } from './day.model';

@ObjectType({ description: 'Paginated day model' })
export class DaysPaginationModel {
  @Field(() => [DayModel], { description: 'List of days' })
  days: DayModel[];

  @Field(() => Int, { description: 'Total count of days' })
  total: number;
}
