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
import { map } from 'rxjs';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  @Post()
  async create(@Body() createDayDto: CreateDayDto, @Res() res: Response) {
    await this.dayService.create(createDayDto);
    return res.redirect('/day');
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
  newForm() {
    return { stats: true };
  }

  @Get(':id/edit')
  @Render('day-edit')
  async editForm(@Param('id') id: string) {
    const day = await this.dayService.findOne(+id);
    if (!day) {
      throw new Error(`Day with id ${id} not found`);
    }
    return {
      stats: true,
      day: {
        id: day.id,
        date: day.date.toISOString().split('T')[0],
        wakeUpTime: day.wakeUpTime,
        wakeDownTime: day.wakeDownTime,
        getup_score: day.getup_score,
        feeling_score: day.feeling_score,
        description: day.description,
        routineNames: day.routines.map((dr) => dr.routine.name),
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
