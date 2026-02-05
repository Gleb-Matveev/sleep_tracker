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
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
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
  ApiCookieAuth,
} from '@nestjs/swagger';
import {
  GoalResponseDto,
  PaginatedGoalResponseDto,
} from './dto/goal-response.dto';
import { UserId } from 'src/auth/decorators/userid.decorator';
import { GoalAdapter } from './goal.adapter';

@ApiTags('Goals')
@ApiCookieAuth('sAccessToken')
@Controller('api/goals')
export class GoalApiController {
  constructor(
    private readonly goalService: GoalService,
    private readonly paginationService: PaginationService,
    private readonly goalAdapter: GoalAdapter,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new goal',
    description: 'Creates a new goal with the provided data',
  })
  @ApiBody({
    type: CreateGoalDto,
    description: 'Data for creating a goal',
  })
  @ApiCreatedResponse({
    type: GoalResponseDto,
    description: 'Goal successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data. Check the format and required fields',
  })
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @UserId() userId: number
  ) {
    return this.goalAdapter.toResponseDto(await this.goalService.create(createGoalDto, userId));
  }

  @Get()
  @ApiOperation({
    summary: 'Get all goals',
    description:
      'Returns a list of goals with pagination. Use query parameters page and limit to control pagination. Pagination parameters are described in PaginationDto.',
  })
  @ApiOkResponse({
    type: PaginatedGoalResponseDto,
    description:
      'Successful response with list of goals and pagination metadata',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid pagination parameters (page < 1 or limit outside allowed range)',
  })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @UserId() userId: number
  ) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;

    const { data, total } = await this.goalService.findAllPaginated(
      page,
      limit,
      userId
    );

    const goalsDto = data.map((goal) => this.goalAdapter.toResponseDto(goal));

    const response = this.paginationService.createPaginatedResponse(
      goalsDto,
      total,
      page,
      limit,
      req,
      res,
    );

    return response;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get goal by ID',
    description: 'Returns information about a specific goal by its identifier',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique goal identifier',
    example: 1,
  })
  @ApiOkResponse({
    type: GoalResponseDto,
    description: 'Goal found and returned',
  })
  @ApiResponse({
    status: 404,
    description: 'Goal with the specified ID not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format (must be a number)',
  })
  async findOne(
    @Param('id') id: string,
    @UserId() userId: number
  ) {
    return this.goalAdapter.toResponseDto(await this.goalService.findOne(+id, userId));;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update goal',
    description:
      'Updates data of an existing goal. Only specified fields can be updated (partial update).',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique goal identifier',
    example: 1,
  })
  @ApiBody({
    type: UpdateGoalDto,
    description: 'Data for updating the goal (all fields are optional)',
  })
  @ApiOkResponse({
    type: GoalResponseDto,
    description: 'Goal successfully updated',
  })
  @ApiResponse({
    status: 404,
    description: 'Goal with the specified ID not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data or ID format',
  })
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @UserId() userId: number
  ) {
    return this.goalAdapter.toResponseDto(await this.goalService.update(+id, updateGoalDto, userId));
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete goal',
    description: 'Deletes a goal by the specified identifier',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique goal identifier',
    example: 1,
  })
  @ApiOkResponse({
    type: GoalResponseDto,
    description: 'Goal successfully deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'Goal with the specified ID not found',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format (must be a number)',
  })
  async remove(
    @Param('id') id: string,
    @UserId() userId: number
  ): Promise<GoalResponseDto> {
    return this.goalAdapter.toResponseDto(await this.goalService.remove(+id, userId));
  }
}
