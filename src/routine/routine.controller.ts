import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import type { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { RoutineResponseDto } from './dto/routine-response.dto';
import { UserId } from 'src/auth/decorators/userid.decorator';

@ApiExcludeController()
@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  async create(
    @Body() createRoutineDto: CreateRoutineDto,
    @UserId() userId: number
  ) {
    const steps =
      Array.isArray(createRoutineDto.steps)
        ? createRoutineDto.steps.map((s) => s.trim()).filter(Boolean)
        : [];

    await this.routineService.create({
      ...createRoutineDto,
      steps,
    }, userId);
  }

  @Get()
  @Render('routine/routines')
  async findAll(
    @UserId() userId: number
  ): Promise<{ routines: boolean; items: RoutineResponseDto[] }> {
    const routines = await this.routineService.findAll(userId);

    const routinesDto: RoutineResponseDto[] = routines.map((routine) => ({
      id: routine.id,
      name: routine.name,
      period: routine.period,
      steps: routine.steps,
    }));

    return {
      routines: true,
      items: routinesDto,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateRoutineDto: UpdateRoutineDto,
    @UserId() userId: number
  ) {
    const steps =
      Array.isArray(updateRoutineDto.steps)
        ? updateRoutineDto.steps.map((s) => s.trim()).filter(Boolean)
        : undefined;

    await this.routineService.update(+id, {
      ...updateRoutineDto,
      steps
    }, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserId() userId: number
  ) {
    return this.routineService.remove(+id, userId);
  }

  @Get('new')
  @Render('routine/new')
  newForm(): { routines: boolean } {
    return { routines: true };
  }

  @Get(':id/edit')
  @Render('routine/edit')
  async editForm(
    @Param('id') id: string,
    @UserId() userId: number
  ): Promise<{ routines: boolean; routine: RoutineResponseDto }> {
    const routine = await this.routineService.findOne(+id, userId);
    
    if (!routine) {
      throw new Error(`Routine with id ${id} not found`);
    }

    const routineDto: RoutineResponseDto = {
      id: routine.id,
      name: routine.name,
      period: routine.period,
      steps: routine.steps,
    };

    return {
      routines: true,
      routine: routineDto,
    };
  }
}
