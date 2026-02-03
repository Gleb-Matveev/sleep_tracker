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
  Sse,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import type { Response } from 'express';
import { GoalsEventsService } from './goal.events';
import { map, Observable } from 'rxjs';
import { ApiExcludeController } from '@nestjs/swagger';
import { GoalResponseDto } from './dto/goal-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserId } from 'src/auth/supertokens/userid.decorator';

@ApiExcludeController()
@Controller('goal')
export class GoalController {
  constructor(
    private readonly goalService: GoalService,
    private goalEventsService: GoalsEventsService,
  ) {}

  @Sse('events')
  stream(): Observable<MessageEvent> {
    const events$ = this.goalEventsService
      .asObservable()
      .pipe(map((event) => ({ data: JSON.stringify(event) })));
    return events$;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createGoalDto: CreateGoalDto,
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: number
  ) {
    await this.goalService.create(createGoalDto, userId, file);
  }

  @Get()
  @Render('goal/goals')
  async findAll(
    @UserId() userId: number
  ): Promise<{ goals: boolean; items: GoalResponseDto[] }> {
    const goals = await this.goalService.findAll(userId);

    const goalsDto: GoalResponseDto[] = goals.map((goal) => ({
      id: goal.id,
      name: goal.name,
      description: goal.description,
      image_url: goal.image_url,
      status: goal.status,
    }));

    return {
      goals: true,
      items: goalsDto,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateGoalDto: UpdateGoalDto,
    @UserId() userId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    await this.goalService.update(+id, updateGoalDto, userId, file);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserId() userId: number
  ) {
    return this.goalService.remove(+id, userId);
  }

  @Get('new')
  @Render('goal/new')
  newForm(): { goals: boolean } {
    return { goals: true };
  }

  @Get(':id/edit')
  @Render('goal/edit')
  async editForm(
    @Param('id') id: string,
    @UserId() userId: number
  ): Promise<{ goals: boolean; goal: GoalResponseDto }> {
    const goal = await this.goalService.findOne(+id, userId);
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
}
