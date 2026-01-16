import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../entities/goal.entity';

export class GoalResponseDto {
  @ApiProperty({ description: 'Unique goal identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Goal name', example: 'Sleep 8 hours' })
  name: string;

  @ApiProperty({ description: 'Goal description', example: 'Sleep at least 8 hours every night' })
  description: string;

  @ApiProperty({ 
    description: 'Goal status', 
    enum: Status,
    example: Status.NOTDONE 
  })
  status: Status;
}

export class PaginatedGoalResponseDto {
  @ApiProperty({ 
    description: 'Array of goals', 
    type: [GoalResponseDto] 
  })
  data: GoalResponseDto[];

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
