import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
} from '@nestjs/common';
import { DayService } from './day.service';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { formatDate, formatTime } from '../presentation/formatters/date';
import type { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import {
  DayResponseDto,
  RoutineInDayResponseDto,
} from './dto/day-response.dto';
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto';

@ApiExcludeController()
@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Post()
  async create(@Body() createDayDto: CreateDayDto) {
    await this.dayService.create(createDayDto);
  }

  @Get()
  @Render('day/days')
  async findAll(): Promise<{ daysDto: DayResponseDto[] }> {
    const stats = await this.dayService.findAll();

    const daysDto: DayResponseDto[] = stats.map((day) => ({
      id: day.id,
      date: formatDate(day.date),
      getup_score: day.getup_score,
      feeling_score: day.feeling_score,
      wakeUpTime: formatTime(day.wakeUpTime),
      wakeDownTime: formatTime(day.wakeDownTime),
      routines: day.routines.map(
        (dayroutine) =>
          ({
            id: dayroutine.routine.id,
            name: dayroutine.routine.name,
          }) as RoutineInDayResponseDto,
      ),
      description: day.description,
    }));

    return { daysDto };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDayDto: UpdateDayDto,
    @Res() res: Response,
  ) {
    await this.dayService.update(+id, updateDayDto);
    return res.redirect('/day');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayService.remove(+id);
  }

  @Get('new')
  @Render('day/new')
  async newForm() {
    const routines = await this.dayService.findAllRoutines();

    return { routines };
  }

  @Get(':id/edit')
  @Render('day/edit')
  async editForm(
    @Param('id') id: string,
  ): Promise<{
    dayDto: DayResponseDto;
    routines: RoutineResponseDto[];
    selectedRoutineIds: number[];
  }> {
    const day = await this.dayService.findOne(+id);
    const routines = await this.dayService.findAllRoutines();

    if (!day) {
      throw new Error(`Day with id ${id} not found`);
    }

    const routinesDto: RoutineResponseDto[] = routines.map((routine) => ({
      id: routine.id,
      name: routine.name,
      period: routine.period,
      steps: routine.steps,
    }));

    const selectedRoutineIds: number[] = day.routines.map(
      (dr) => dr.routine.id,
    );

    const dayDto: DayResponseDto = {
      id: day.id,
      date: day.date.toISOString().split('T')[0],
      getup_score: day.getup_score,
      feeling_score: day.feeling_score,
      wakeUpTime: formatTime(day.wakeUpTime),
      wakeDownTime: formatTime(day.wakeDownTime),
      routines: day.routines.map(
        (dayroutine) =>
          ({
            id: dayroutine.routine.id,
            name: dayroutine.routine.name,
          }) as RoutineInDayResponseDto,
      ),
      description: day.description,
    };

    return { 
      dayDto, 
      routines: routinesDto, 
      selectedRoutineIds 
    };
  }

  @Get('graph')
  @Render('graph')
  async graph() {
    const stats = await this.dayService.findAll();

    type Mapped = {
      labels: string[];
      getup_data: number[];
      feeling_data: number[];
    };

    const mapped = stats.reduce<Mapped>(
      (acc, day) => {
        acc.labels.push(formatDate(day.date));
        acc.getup_data.push(day.getup_score);
        acc.feeling_data.push(day.feeling_score);
        return acc;
      },
      { labels: [], getup_data: [], feeling_data: [] },
    );

    return {
      graph: true,
      labels: mapped.labels,
      getup_data: mapped.getup_data,
      feeling_data: mapped.feeling_data,
    };
  }

  @Get('routines')
  async findAllRoutines(): Promise<{ routinesDto: RoutineResponseDto[] }> {
    const routines = await this.dayService.findAllRoutines();

    const routinesDto: RoutineResponseDto[] = routines.map((routine) => ({
      id: routine.id,
      name: routine.name,
      period: routine.period,
      steps: routine.steps,
    }));

    return { routinesDto };
  }
}
