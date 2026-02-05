import { ApiProperty } from '@nestjs/swagger';

export class RuleResponseDto {
  @ApiProperty({ description: 'Unique rule identifier', example: 1 })
  id: number;

  @ApiProperty({ description: 'Rule name', example: 'No screens before bed' })
  name: string;

  @ApiProperty({ description: 'Rule description', example: 'Avoid using electronic devices 1 hour before sleep' })
  description: string;

  @ApiProperty({ description: 'Time server took to respond', example: '70.7723330000008' })
  serverResponseTime?: number;
}

export class PaginatedRuleResponseDto {
  @ApiProperty({ 
    description: 'Array of rules', 
    type: [RuleResponseDto] 
  })
  data: RuleResponseDto[];

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
