import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGoalDto } from './create-goal.dto';
import { Status } from '../entities/goal.entity';
import { IsOptional, IsString } from 'class-validator';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {
  @ApiPropertyOptional({
    description: 'Goal name',
    example: 'Sleep 8 hours',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Goal description',
    example: 'Sleep at least 8 hours every night',
  })
  description?: string;

  @ApiProperty({
    description: 'Assocciated image url',
    example: 'https:://...',
  })
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional({
    description: 'Goal status',
    enum: Status,
    example: Status.DONE,
  })
  status?: Status;
}
