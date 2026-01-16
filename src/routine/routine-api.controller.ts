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
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
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
import { RoutineResponseDto, PaginatedRoutineResponseDto } from './dto/routine-response.dto';
import { DayResponseDto } from '../day/dto/day-response.dto';

@ApiTags('Routines')
@Controller('api/routines')
export class RoutineApiController {
  constructor(
    private readonly routineService: RoutineService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new routine', 
    description: 'Creates a new routine with the provided data' 
  })
  @ApiBody({ 
    type: CreateRoutineDto, 
    description: 'Data for creating a routine' 
  })
  @ApiCreatedResponse({ 
    type: RoutineResponseDto, 
    description: 'Routine successfully created' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data. Check the format and required fields' 
  })
  async create(@Body() createRoutineDto: CreateRoutineDto) {
    return await this.routineService.create(createRoutineDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all routines', 
    description: 'Returns a list of routines with pagination. Use query parameters page and limit to control pagination. Pagination parameters are described in PaginationDto.' 
  })
  @ApiOkResponse({ 
    type: PaginatedRoutineResponseDto,
    description: 'Successful response with list of routines and pagination metadata' 
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

    const { data, total } = await this.routineService.findAllPaginated(page, limit);
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
    summary: 'Get routine by ID', 
    description: 'Returns information about a specific routine by its identifier' 
  })
  @ApiParam({ 
    name: 'id', 
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
    description: 'Routine with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async findOne(@Param('id') id: string) {
    const routine = await this.routineService.findOne(+id);
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine;
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Update routine', 
    description: 'Updates data of an existing routine. Only specified fields can be updated (partial update).' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique routine identifier',
    example: 1
  })
  @ApiBody({ 
    type: UpdateRoutineDto, 
    description: 'Data for updating the routine (all fields are optional)' 
  })
  @ApiOkResponse({ 
    type: RoutineResponseDto,
    description: 'Routine successfully updated' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Routine with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid request data or ID format' 
  })
  async update(
    @Param('id') id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    return await this.routineService.update(+id, updateRoutineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete routine', 
    description: 'Deletes a routine by the specified identifier' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique routine identifier',
    example: 1
  })
  @ApiNoContentResponse({ 
    description: 'Routine successfully deleted' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Routine with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async remove(@Param('id') id: string) {
    await this.routineService.remove(+id);
  }

  @Get(':id/days')
  @ApiOperation({ 
    summary: 'Get all days for a routine', 
    description: 'Returns all days associated with a specific routine' 
  })
  @ApiParam({ 
    name: 'id', 
    type: Number, 
    description: 'Unique routine identifier',
    example: 1
  })
  @ApiOkResponse({ 
    type: [DayResponseDto],
    description: 'List of days for the routine' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Routine with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async getRoutineDays(@Param('id') id: string) {
    const routine = await this.routineService.findOne(+id);
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine.days?.map((dr) => dr.day) || [];
  }

  @Get(':routineId/days/:dayId')
  @ApiOperation({ 
    summary: 'Get specific day for a routine', 
    description: 'Returns a specific day associated with a routine' 
  })
  @ApiParam({ 
    name: 'routineId', 
    type: Number, 
    description: 'Unique routine identifier',
    example: 1
  })
  @ApiParam({ 
    name: 'dayId', 
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
    description: 'Routine or day with the specified ID not found' 
  })
  @ApiBadRequestResponse({ 
    description: 'Invalid ID format (must be a number)' 
  })
  async getRoutineDay(
    @Param('routineId') routineId: string,
    @Param('dayId') dayId: string,
  ) {
    const routine = await this.routineService.findOne(+routineId);
    if (!routine) {
      throw new NotFoundException(`Routine with id ${routineId} not found`);
    }
    const day = routine.days?.find((dr) => dr.day.id === +dayId)?.day;
    if (!day) {
      throw new NotFoundException(
        `Day with id ${dayId} not found for routine ${routineId}`,
      );
    }
    return day;
  }
}
