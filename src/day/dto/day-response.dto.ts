import { ApiProperty } from '@nestjs/swagger';
import { DatabaseType } from 'typeorm';

export class RoutineInDayResponseDto {
  @ApiProperty({ description: 'Routine ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Routine name', example: 'Morning meditation' })
  name: string;
}

export class DayResponseDto {
  @ApiProperty({ description: 'Unique day identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date of the day', example: '2024-01-15' })
  date: Date | string;

  @ApiProperty({ description: 'Get up score (0-10)', example: 7.5, minimum: 0, maximum: 10 })
  getup_score: number;

  @ApiProperty({ description: 'Feeling score (0-10)', example: 8.0, minimum: 0, maximum: 10 })
  feeling_score: number;

  @ApiProperty({ description: 'Wake up time', example: '07:30' })
  wakeUpTime: string;

  @ApiProperty({ description: 'Bed time', example: '23:00' })
  wakeDownTime: string;

  @ApiProperty({ description: 'Day description', example: 'Slept well, felt refreshed', required: false })
  description: string;

  @ApiProperty({ 
    description: 'Routines completed on this day', 
    type: [RoutineInDayResponseDto],
    required: false
  })
  routines?: RoutineInDayResponseDto[];
}

export class PaginatedDayResponseDto {
  @ApiProperty({ 
    description: 'Array of days', 
    type: [DayResponseDto] 
  })
  data: DayResponseDto[];

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
