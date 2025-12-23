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
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import type { Response } from 'express';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  async create(@Body() createGoalDto: CreateGoalDto, @Res() res: Response) {
    await this.goalService.create(createGoalDto);
    return res.redirect('/goal');
  }

  @Get()
  @Render('goals')
  async findAll() {
    /*const goals = [
      {
        title: 'Sleep 8 hours on weekdays',
        description:
          'Lights out by 23:30 and wake up at 07:30, at least 5 days a week.',
      },
      {
        title: 'No screens 30 minutes before bed',
        description:
          'Replace the phone with a book or calm music before sleep.',
      },
    ];*/
    const goals = await this.goalService.findAll();

    return {
      goals: true,
      items: goals,
    };
  }

  @Get('new')
  @Render('goal-new')
  newForm() {
    return { goals: true };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
