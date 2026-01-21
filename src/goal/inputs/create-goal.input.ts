import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '../entities/goal.entity';
import { IsEnum, IsString } from 'class-validator';

@InputType({ description: 'Input type for creating a goal' })
export class CreateGoalInput {
  @Field(() => String, { description: 'Name of the goal' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the goal' })
  @IsString()
  description: string;

  @Field(() => Status, { description: 'Status of the goal' })
  @IsEnum(Status)
  status: Status;

  //user: User;
}
