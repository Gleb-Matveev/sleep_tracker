import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { DayService } from './day.service';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';

@Controller('day')
export class DayController {
  constructor(private readonly dayService: DayService) {}

  private getCommonViewData(extra: Record<string, unknown> = {}) {
    return {
      year: new Date().getFullYear(),
      ...extra,
    };
  }

  @Post()
  create(@Body() createDayDto: CreateDayDto) {
    return this.dayService.create(createDayDto);
  }

  @Get()
  @Render('statistics')
  findAll() {
    const stats = [
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
    ];

    return this.getCommonViewData({
      stats: true,
      statistics: stats,
    });
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
