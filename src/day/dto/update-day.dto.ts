import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateDayDto } from './create-day.dto';

export class UpdateDayDto extends PartialType(
  OmitType(CreateDayDto, ['routineIds'] as const), ) {
  @ApiPropertyOptional({ 
    description: 'Date of the day', 
    example: '2024-01-15'
  })
  date?: string;

  @ApiPropertyOptional({ 
    description: 'Get up score (0-10)', 
    example: 7.5,
    minimum: 0,
    maximum: 10
  })
  getup_score?: number;

  @ApiPropertyOptional({ 
    description: 'Feeling score (0-10)', 
    example: 8.0,
    minimum: 0,
    maximum: 10
  })
  feeling_score?: number;

  @ApiPropertyOptional({ 
    description: 'Wake up time in HH:mm format', 
    example: '07:30'
  })
  wakeUpTime?: string;

  @ApiPropertyOptional({ 
    description: 'Bed time in HH:mm format', 
    example: '23:00'
  })
  wakeDownTime?: string;

  @ApiPropertyOptional({ 
    description: 'Day description', 
    example: 'Slept well, felt refreshed'
  })
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Array of routine IDs completed on this day', 
    type: [Number],
    example: [1, 2, 3]
  })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  routineIds?: number[];
}
