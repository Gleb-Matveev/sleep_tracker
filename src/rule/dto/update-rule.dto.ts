import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateRuleDto } from './create-rule.dto';

export class UpdateRuleDto extends PartialType(CreateRuleDto) {
  @ApiPropertyOptional({ 
    description: 'Rule name', 
    example: 'No screens before bed'
  })
  name?: string;

  @ApiPropertyOptional({ 
    description: 'Rule description', 
    example: 'Avoid using electronic devices 1 hour before sleep'
  })
  description?: string;
}
