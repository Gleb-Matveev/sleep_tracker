import { Field, InputType, Int } from '@nestjs/graphql';
import { Status } from '../entities/goal.entity';
import { IsEnum, IsOptional, IsString } from 'class-validator';

@InputType({ description: 'Input type for updating a goal' })
export class UpdateGoalInput {
  @Field(() => String, { 
    nullable: true,
    description: 'Name of the goal' })
  @IsString()
  @IsOptional()
  name: string;

  @Field(() => String, { 
    nullable: true,
    description: 'Description of the goal' })
  @IsString()
  @IsOptional()
  description: string;

  @Field(() => Status, { 
    nullable: true,
    description: 'Status of the goal' })
  @IsEnum(Status)
  @IsOptional()
  status: Status;
}