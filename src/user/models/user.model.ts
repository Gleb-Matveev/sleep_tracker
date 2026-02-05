import {
  Directive,
  Field,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { DayModel } from 'src/day/models/day.model';
import { GoalModel } from 'src/goal/models/goal.model';
import { RoutineModel } from 'src/routine/models/routine.model';
import { RuleModel } from 'src/rule/models/rule.model';
import { User, UserRole } from 'src/user/entities/user.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'ADMIN or USER',
});

@ObjectType({ description: 'User' })
export class UserModel {
  @Field(() => ID, {
    nullable: true,
    description: 'Unique identifier for the user',
  })
  id: number;

  @Field(() => String, {
    nullable: true,
    description: 'Unique identifier for the user from SUPERTOKEN service',
  })
  supertoken_id: string;

  @Field({ description: 'Email of user' })
  email: string;

  @Field({ description: 'Avatar image url' })
  avatar_url: string;

  @Field(() => UserRole, { description: 'Users role'})
  role: UserRole;

  @Field(() => [DayModel], { description: 'Days associated with user'})
  days: DayModel[];

  @Field(() => [RoutineModel], { description: 'Routines associated with user'})
  routines: RoutineModel[];

  @Field(() => [GoalModel], { description: 'Goals associated with user'})
  goals: GoalModel[];

  @Field(() => [RuleModel], { description: 'Rules associated with user'})
  rules: RuleModel[];
}
