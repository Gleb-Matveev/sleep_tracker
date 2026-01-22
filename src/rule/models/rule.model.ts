import { Directive, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/user/entities/user.entity';

@ObjectType({ description: 'Rule' })
export class RuleModel {
  @Field(() => ID, { nullable: true, description: 'Unique identifier for the rule' })
  id: number;

  @Field({ description: 'Name of the rule' })
  name: string;

  @Field({ description: 'Description of the rule' })
  description: string;
  
  /*@Field(() => User, { description: 'User associated with the rule' })
  user: User;*/
}
