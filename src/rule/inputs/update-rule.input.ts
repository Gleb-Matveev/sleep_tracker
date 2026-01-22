import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType({ description: 'Input type for updating a rule' })
export class UpdateRuleInput {
  @Field(() => String, { 
    nullable: true,
    description: 'Name of the rule' })
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => String, { 
    nullable: true,
    description: 'Description of the rule' })
  @IsString()
  @IsOptional()
  description: string;

  //user: User;
}