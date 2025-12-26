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
  MessageEvent,
  Sse
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import type { Response } from 'express';
import { GoalsEventsService } from './goal.events';
import { map, Observable } from 'rxjs';

@Controller('goal')
export class GoalController {
  constructor(private readonly goalService: GoalService,
    private goalEventsService: GoalsEventsService
  ) {}

  @Sse('events')
  stream(): Observable<MessageEvent> {
    const events$ = this.goalEventsService.asObservable().pipe(
      map((event) => ({ data: JSON.stringify(event) }))
    );
    return events$;
  }

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
