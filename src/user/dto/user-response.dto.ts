import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Day } from '../../day/entities/day.entity';
import { Routine } from '../../routine/entities/routine.entity';
import { Goal } from '../../goal/entities/goal.entity';
import { Rule } from '../../rule/entities/rule.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';
import { DayResponseDto } from 'src/day/dto/day-response.dto';
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto';
import { GoalResponseDto } from 'src/goal/dto/goal-response.dto';
import { RuleResponseDto } from 'src/rule/dto/rule-response.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'Unique user identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Unique user identifier for SUPERTOKEN service', example: 1 })
  supertoken_id: string;

  @ApiProperty({ description: "User's email", example: "gleb@gmail.com" })
  email: string;

  @ApiProperty({ description: 'Link to avatar image', example: "https://..." })
  avatar_url: string;

  @ApiProperty({ description: 'User role', example: "ADMIN" })
  role: UserRole;

  @ApiProperty({ description: 'Associated days', type: [DayResponseDto] })
  days: DayResponseDto[];

  @ApiProperty({ description: 'Associated routines', type: [RoutineResponseDto]  })
  routines: RoutineResponseDto[];

  @ApiProperty({ description: 'Associated goals', type: [GoalResponseDto] })
  goals: GoalResponseDto[];

  @ApiProperty({ description: 'Associated rules', type: [RuleResponseDto] })
  rules: RuleResponseDto[];
}

export class PaginatedUserResponseDto {
  @ApiProperty({ 
    description: 'Array of users', 
    type: [UserResponseDto] 
  })
  data: UserResponseDto[];

  @ApiProperty({ 
    description: 'Pagination metadata',
    example: {
      total: 50,
      page: 1,
      limit: 10,
      totalPages: 5
    }
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

