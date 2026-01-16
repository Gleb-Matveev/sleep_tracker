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
import { DayService } from './day.service';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
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
import { DayResponseDto, PaginatedDayResponseDto } from './dto/day-response.dto';
import { RoutineResponseDto } from '../routine/dto/routine-response.dto';

@ApiTags('Days')
@Controller('api/days')
export class DayApiController {
  constructor(
    private readonly dayService: DayService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new day', 
    description: 'Creates a new day with the provided data' 
  })
  @ApiBody({ 
    type: CreateDayDto, 
    description: 'Data for creating a day' 
  })
  @ApiCreatedResponse({ 
    type: DayResponseDto, 
    description: 'Day successfully created' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data. Check the format and required fields' 
  })
  async create(@Body() createDayDto: CreateDayDto) {
    return await this.dayService.create(createDayDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all days', 
    description: 'Returns a list of days with pagination. Use query parameters page and limit to control pagination. Pagination parameters are described in PaginationDto.' 
  })
  @ApiOkResponse({ 
    type: PaginatedDayResponseDto,
    description: 'Successful response with list of days and pagination metadata' 
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

    const { data, total } = await this.dayService.findAllPaginated(page, limit);
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
    summary: 'Get day by ID', 
    description: 'Returns information about a specific day by its identifier' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique day identifier',
    example: 1
  })
  @ApiOkResponse({ 
    type: DayResponseDto,
    description: 'Day found and returned' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Day with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async findOne(@Param('id') id: string) {
    const day = await this.dayService.findOne(+id);
    if (!day) {
      throw new NotFoundException(`Day with id ${id} not found`);
    }
    return day;
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update day', 
    description: 'Updates data of an existing day. Only specified fields can be updated (partial update).' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique day identifier',
    example: 1
  })
  @ApiBody({ 
    type: UpdateDayDto, 
    description: 'Data for updating the day (all fields are optional)' 
  })
  @ApiOkResponse({ 
    type: DayResponseDto,
    description: 'Day successfully updated' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Day with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data or ID format' 
  })
  async update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto) {
    return await this.dayService.update(+id, updateDayDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete day', 
    description: 'Deletes a day by the specified identifier' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique day identifier',
    example: 1
  })
  @ApiNoContentResponse({ 
    description: 'Day successfully deleted' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Day with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async remove(@Param('id') id: string) {
    await this.dayService.remove(+id);
  }

  @Get(':id/routines')
  @ApiOperation({ 
    summary: 'Get all routines for a day', 
    description: 'Returns all routines associated with a specific day' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique day identifier',
    example: 1
  })
  @ApiOkResponse({ 
    type: [RoutineResponseDto],
    description: 'List of routines for the day' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Day with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async getDayRoutines(@Param('id') id: string) {
    const day = await this.dayService.findOne(+id);
    if (!day) {
      throw new NotFoundException(`Day with id ${id} not found`);
    }
    return day.routines.map((dr) => dr.routine);
  }

  @Get(':dayId/routines/:routineId')
  @ApiOperation({ 
    summary: 'Get specific routine for a day', 
    description: 'Returns a specific routine associated with a day' 
  })
  @ApiParam({ 
    name: 'dayId', 
    type: Number, 
    description: 'Unique day identifier',
    example: 1
  })
  @ApiParam({ 
    name: 'routineId', 
    type: Number, 
    description: 'Unique routine identifier',
    example: 1
  })
  @ApiOkResponse({ 
    type: RoutineResponseDto,
    description: 'Routine found and returned' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Day or routine with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async getDayRoutine(
    @Param('dayId') dayId: string,
    @Param('routineId') routineId: string,
  ) {
    const day = await this.dayService.findOne(+dayId);
    if (!day) {
      throw new NotFoundException(`Day with id ${dayId} not found`);
    }
    const routine = day.routines.find(
      (dr) => dr.routine.id === +routineId,
    )?.routine;
    if (!routine) {
      throw new NotFoundException(
        `Routine with id ${routineId} not found for day ${dayId}`,
      );
    }
    return routine;
  }
}
