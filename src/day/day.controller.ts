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

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Post()
  async create(@Body() createDayDto: CreateDayDto) {
    await this.dayService.create(createDayDto);
  }

  @Get()
  @Render('day')
  async findAll() {
    const stats = await this.dayService.findAll();

    const statistics = stats.map((day) => ({
      id: day.id,
      date: formatDate(day.date),
      getup_score: day.getup_score,
      feeling_score: day.feeling_score,
      wakeUpTime: formatTime(day.wakeUpTime),
      wakeDownTime: formatTime(day.wakeDownTime),
      routines: day.routines,
      description: day.description,
    }));

    return {
      day: true,
      statistics,
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
      feeling_data: mapped.feeling_data
    };
  }

  @Get('new')
  @Render('day-new')
  async newForm() {
    const routines = await this.dayService.findAllRoutines();

    console.log(routines);
    return {
      routines: routines,
    };
  }

  @Get(':id/edit')
  @Render('day-edit')
  async editForm(@Param('id') id: string) {
    const days = await this.dayService.findOne(+id);
    const routines = await this.dayService.findAllRoutines();

    if (!days) {
      throw new Error(`Day with id ${id} not found`);
    }

    return {
      day: {
        id: days.id,
        date: days.date.toISOString().split('T')[0],
        wakeUpTime: days.wakeUpTime,
        wakeDownTime: days.wakeDownTime,
        getup_score: days.getup_score,
        feeling_score: days.feeling_score,
        description: days.description,
        selectedRoutineIds: days.routines.map((dr) => dr.routine.id),
        routines: routines,
      },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto, @Res() res: Response) {
    await this.dayService.update(+id, updateDayDto);
    return res.redirect('/day');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayService.remove(+id);
  }

  @Get('routines')
  async findAllRoutines() {
    const routines = await this.dayService.findAllRoutines();

    return {
      routins: true,
      items: routines,
    };
  }
}
