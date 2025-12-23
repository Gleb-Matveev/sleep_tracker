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
  async create(@Body() createDayDto: CreateDayDto, @Res() res: Response) {
    await this.dayService.create(createDayDto);
    return res.redirect('/day');
  }

  @Get()
  @Render('statistics')
  async findAll() {
    /*const stats = [
      {
        date: '2025-12-17',
        score1: 8.2,
        score2: 7.5,
        description: 'Fell asleep quickly, woke up refreshed.',
      },
      {
        date: '2025-12-18',
        score1: 6.1,
        score2: 5.4,
        description: 'Late bedtime, some night awakenings.',
      },
    ];*/

    const stats = await this.dayService.findAll();

    const statistics = stats.map((day) => ({
      id: day.id,
      date: formatDate(day.date),
      getup_score: day.getup_score,
      feeling_score: day.feeling_score,
      wakeUpTime: formatTime(day.wakeUpTime),
      wakeDownTime: formatTime(day.wakeDownTime),
      description: day.description,
    }));

    return {
      stats: true,
      statistics,
    };
  }

  @Get('new')
  @Render('day-new')
  newForm() {
    return { stats: true };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto) {
    return this.dayService.update(+id, updateDayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dayService.remove(+id);
  }
}
