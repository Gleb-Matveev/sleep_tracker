import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Query,
  Res,
  Req,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginationService } from '../common/services/pagination.service';
import type { Request, Response } from 'express';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiBody, 
  ApiParam, 
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { RuleResponseDto, PaginatedRuleResponseDto } from './dto/rule-response.dto';

@ApiTags('Rules')
@Controller('api/rules')
export class RuleApiController {
  constructor(
    private readonly ruleService: RuleService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new rule', 
    description: 'Creates a new rule with the provided data' 
  })
  @ApiBody({ 
    type: CreateRuleDto, 
    description: 'Data for creating a rule' 
  })
  @ApiCreatedResponse({ 
    type: RuleResponseDto, 
    description: 'Rule successfully created' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data. Check the format and required fields' 
  })
  async create(@Body() createRuleDto: CreateRuleDto) {
    return await this.ruleService.create(createRuleDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all rules', 
    description: 'Returns a list of rules with pagination. Use query parameters page and limit to control pagination. Pagination parameters are described in PaginationDto.' 
  })
  @ApiOkResponse({ 
    type: PaginatedRuleResponseDto,
    description: 'Successful response with list of rules and pagination metadata' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid pagination parameters (page < 1 or limit outside allowed range)' 
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const { data, total } = await this.ruleService.findAllPaginated(page, limit);
    const response = this.paginationService.createPaginatedResponse(
      data,
      total,
      page,
      limit,
      req,
      res,
    );

    return res.json(response);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get rule by ID', 
    description: 'Returns information about a specific rule by its identifier' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique rule identifier',
    example: 1
  })
  @ApiOkResponse({ 
    type: RuleResponseDto,
    description: 'Rule found and returned' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rule with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async findOne(@Param('id') id: string) {
    const rule = await this.ruleService.findOne(+id);
    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }
    return rule;
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update rule', 
    description: 'Updates data of an existing rule. Only specified fields can be updated (partial update).' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique rule identifier',
    example: 1
  })
  @ApiBody({ 
    type: UpdateRuleDto, 
    description: 'Data for updating the rule (all fields are optional)' 
  })
  @ApiOkResponse({ 
    type: RuleResponseDto,
    description: 'Rule successfully updated' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rule with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data or ID format' 
  })
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return await this.ruleService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete rule', 
    description: 'Deletes a rule by the specified identifier' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique rule identifier',
    example: 1
  })
  @ApiNoContentResponse({ 
    description: 'Rule successfully deleted' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rule with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async remove(@Param('id') id: string) {
    await this.ruleService.remove(+id);
  }
}
