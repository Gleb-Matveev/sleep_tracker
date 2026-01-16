import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRoutineDto } from './create-routine.dto';
import { RoutinePeriod } from '../entities/routine.entity';

export class UpdateRoutineDto extends PartialType(CreateRoutineDto) {
  @ApiPropertyOptional({ 
    description: 'Routine name', 
    example: 'Morning meditation'
  })
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Routine period', 
    enum: RoutinePeriod,
    example: RoutinePeriod.DAY
  })
  period?: RoutinePeriod;

  @ApiPropertyOptional({ 
    description: 'Routine steps', 
    type: [String],
    example: ['Wake up', 'Drink water', 'Meditate for 10 minutes']
  })
  steps?: string[];
}
