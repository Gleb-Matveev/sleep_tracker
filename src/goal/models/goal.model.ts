import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';
import { Status } from '../entities/goal.entity';

registerEnumType(Status, {
  name: 'GoalStatus',
  description: 'Goal status',
});

@ObjectType({ description: 'Goal' })
export class GoalModel {
  @Field(() => ID, { nullable: true, description: 'Unique identifier for the goal' })
  id: number;

  @Field({ description: 'Name of the goal' })
  name: string;

  @Field({ description: 'Description of the goal' })
  description: string;

  @Field(() => Status, { description: 'Status of the goal' })
  status: Status;

  /*@Field(() => User, { description: 'User associated with the goal' })
  user: User;*/
}
