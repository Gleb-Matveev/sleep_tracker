import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import type { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  async create(@Body() createRoutineDto: CreateRoutineDto, @Res() res: Response) {
    const steps =
      Array.isArray(createRoutineDto.steps)
        ? createRoutineDto.steps.map((s) => s.trim()).filter(Boolean)
        : [];

    await this.routineService.create({
      ...createRoutineDto,
      steps,
    });
    return res.redirect('/routine');
  }

  @Get()
  @Render('routine/routins')
  async findAll() {
    const routines = await this.routineService.findAll();

    return {
      routins: true,
      items: routines,
    };
  }

  @Get('new')
  @Render('routine/new')
  newForm() {
    return { routins: true };
  }

  @Get(':id/edit')
  @Render('routine/edit')
  async editForm(@Param('id') id: string) {
    const routine = await this.routineService.findOne(+id);
    if (!routine) {
      throw new Error(`Routine with id ${id} not found`);
    }
    return {
      routines: true,
      routine: {
        id: routine.id,
        name: routine.name,
        period: routine.period,
        steps: routine.steps,
      },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto, @Res() res: Response) {
    const steps =
      Array.isArray(updateRoutineDto.steps)
        ? updateRoutineDto.steps.map((s) => s.trim()).filter(Boolean)
        : undefined;

    await this.routineService.update(+id, {
      ...updateRoutineDto,
      steps,
    });
    return res.redirect('/routine');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routineService.remove(+id);
  }
}
