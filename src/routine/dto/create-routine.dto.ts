import { IsString, IsEnum, IsArray, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoutinePeriod } from "../entities/routine.entity";

export class CreateRoutineDto {
  @ApiProperty({ 
    description: 'Routine name', 
    example: 'Morning meditation',
    required: true 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Routine period', 
    enum: RoutinePeriod,
    example: RoutinePeriod.DAY,
    required: true 
  })
  @IsEnum(RoutinePeriod)
  period: RoutinePeriod;

  @ApiProperty({ 
    description: 'Routine steps', 
    type: [String],
    example: ['Wake up', 'Drink water', 'Meditate for 10 minutes'],
    required: true 
  })
  @IsArray()
  @IsString({ each: true })
  steps: string[];
}
