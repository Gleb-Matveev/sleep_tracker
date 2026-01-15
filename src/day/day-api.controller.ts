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

@Controller('api/days')
export class DayApiController {
  constructor(
    private readonly dayService: DayService,
    private readonly paginationService: PaginationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDayDto: CreateDayDto) {
    return await this.dayService.create(createDayDto);
  }

  @Get()
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
  async findOne(@Param('id') id: string) {
    const day = await this.dayService.findOne(+id);
    if (!day) {
      throw new NotFoundException(`Day with id ${id} not found`);
    }
    return day;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto) {
    return await this.dayService.update(+id, updateDayDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.dayService.remove(+id);
  }

  // Получить все рутины для конкретного дня
  @Get(':id/routines')
  async getDayRoutines(@Param('id') id: string) {
    const day = await this.dayService.findOne(+id);
    if (!day) {
      throw new NotFoundException(`Day with id ${id} not found`);
    }
    return day.routines.map((dr) => dr.routine);
  }

  // Получить конкретную рутину для дня
  @Get(':dayId/routines/:routineId')
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
