import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '../entities/goal.entity';

@InputType({ description: 'Input type for creating a goal' })
export class CreateGoalInput {
  @Field({ description: 'Name of the goal' })
  name: string;

  @Field({ description: 'Description of the goal' })
  description: string;

  @Field(() => Status, { description: 'Status of the goal' })
  status: Status;

  //user: User;
}
