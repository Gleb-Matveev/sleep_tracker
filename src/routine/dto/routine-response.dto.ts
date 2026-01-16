import { ApiProperty } from '@nestjs/swagger';
import { RoutinePeriod } from '../entities/routine.entity';

export class DayInRoutineResponseDto {
  @ApiProperty({ description: 'Day ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Date of the day', example: '2024-01-15' })
  date: Date;
}

export class RoutineResponseDto {
  @ApiProperty({ description: 'Unique routine identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Routine name', example: 'Morning meditation' })
  name: string;

  @ApiProperty({ 
    description: 'Routine period', 
    enum: RoutinePeriod,
    example: RoutinePeriod.DAY 
  })
  period: RoutinePeriod;

  @ApiProperty({ 
    description: 'Routine steps', 
    type: [String],
    example: ['Wake up', 'Drink water', 'Meditate for 10 minutes']
  })
  steps: string[];
}

export class PaginatedRoutineResponseDto {
  @ApiProperty({ 
    description: 'Array of routines', 
    type: [RoutineResponseDto] 
  })
  data: RoutineResponseDto[];

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
