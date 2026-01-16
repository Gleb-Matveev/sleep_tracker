import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRuleDto {
  @ApiProperty({ 
    description: 'Rule name', 
    example: 'No screens before bed',
    required: true 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Rule description', 
    example: 'Avoid using electronic devices 1 hour before sleep',
    required: true 
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
