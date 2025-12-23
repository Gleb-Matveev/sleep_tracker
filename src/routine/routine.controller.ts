import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Res } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import type { Response } from 'express';

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
  @Render('routins')
  async findAll() {
    const routines = await this.routineService.findAll();

    return {
      routins: true,
      items: routines,
    };
  }

  @Get('new')
  @Render('routine-new')
  newForm() {
    return { routins: true };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routineService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routineService.update(+id, updateRoutineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routineService.remove(+id);
  }
}
