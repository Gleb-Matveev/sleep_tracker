import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from "../entities/goal.entity";

export class CreateGoalDto {
  @ApiProperty({ 
    description: 'Goal name', 
    example: 'Sleep 8 hours',
    required: true 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Goal description', 
    example: 'Sleep at least 8 hours every night',
    required: true 
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ 
    description: 'Goal status', 
    enum: Status,
    example: Status.NOTDONE,
    required: true 
  })
  @IsEnum(Status)
  status: Status;
}
