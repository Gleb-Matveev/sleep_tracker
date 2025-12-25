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

  @Get(':id/edit')
  @Render('goal-edit')
  async editForm(@Param('id') id: string) {
    const goal = await this.goalService.findOne(+id);
    if (!goal) {
      throw new Error(`Goal with id ${id} not found`);
    }
    return {
      goals: true,
      goal: {
        id: goal.id,
        name: goal.name,
        description: goal.description,
        status: goal.status,
      },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @Res() res: Response) {
    await this.goalService.update(+id, updateGoalDto);
    return res.redirect('/goal');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goalService.remove(+id);
  }
}
