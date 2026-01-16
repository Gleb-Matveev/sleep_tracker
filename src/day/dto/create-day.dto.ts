import { IsString, IsNumber, IsOptional, IsArray, IsDateString, Min, Max, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDayDto {
  @ApiProperty({ 
    description: 'Date of the day', 
    example: '2024-01-15',
    required: true 
  })
  @IsDateString()
  date: string;

  @ApiProperty({ 
    description: 'Get up score (0-10)', 
    example: 7.5,
    minimum: 0,
    maximum: 10,
    required: true 
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  getup_score: number;

  @ApiProperty({ 
    description: 'Feeling score (0-10)', 
    example: 8.0,
    minimum: 0,
    maximum: 10,
    required: true 
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(10)
  feeling_score: number;

  @ApiProperty({ 
    description: 'Wake up time in HH:mm format', 
    example: '07:30',
    pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
    required: true 
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'wakeUpTime must be in HH:mm format',
  })
  wakeUpTime: string;

  @ApiProperty({ 
    description: 'Bed time in HH:mm format', 
    example: '23:00',
    pattern: '^([0-1][0-9]|2[0-3]):[0-5][0-9]$',
    required: true 
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'wakeDownTime must be in HH:mm format',
  })
  wakeDownTime: string;

  @ApiPropertyOptional({ 
    description: 'Day description', 
    example: 'Slept well, felt refreshed'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'Array of routine IDs completed on this day', 
    type: [Number],
    example: [1, 2, 3],
    required: true 
  })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  routineIds: number[];
}
