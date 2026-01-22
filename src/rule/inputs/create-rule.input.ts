import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType({ description: 'Input type for creating a rule' })
export class CreateRuleInput {
  @Field(() => String, { description: 'Name of the rule' })
  @IsString()
  name: string;

  @Field(() => String, { description: 'Description of the rule' })
  @IsString()
  description: string;

  //user: User;
}
