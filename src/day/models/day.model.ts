import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Field, ID, ObjectType, Query } from '@nestjs/graphql';
import { RoutineModel } from 'src/routine/models/routine.model';

@ObjectType({description: "Day"})
export class DayModel {
  @Field(() => ID, {description: 'Unique identifier for the day'})
  id: number;

  @Field(() => Date, {description: 'Date'})
  date: Date;

  @Field(() => Number, {description: 'How easy was it to get up'})
  getup_score: number;

  @Field(() => Number, {description: 'How well did you feel throughtout the day'})
  feeling_score: number;

  @Field(() => Date, {description: 'Wake up time'})
  wakeUpTime: string;

  @Field(() => Date, {description: 'Time you went to sleep'})
  wakeDownTime: string;

  @Field(() => Date, {description: 'Any additional info on the day'})
  description: string;

  @Field(() => [RoutineModel], {description: 'Routines you completed this day'})
  routines: RoutineModel[];

  //user: User;
}