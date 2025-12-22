import { Controller, Get, Post, Body, Patch, Param, Delete, Render } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('routine')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  private getCommonViewData(extra: Record<string, unknown> = {}) {
    return {
      year: new Date().getFullYear(),
      ...extra,
    };
  }

  @Post()
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routineService.create(createRoutineDto);
  }

  @Get()
  @Render('routins')
  findAll() {
    const routins = [
      {
        name: 'Evening wind-down',
        type: 'night',
        points: [
          'Turn off bright lights 1 hour before bed',
          'Write down tasks for tomorrow',
          '10 minutes of stretching or light yoga',
        ],
      },
      {
        name: 'Morning energy boost',
        type: 'morning',
        points: [
          'Open curtains and get daylight immediately',
          'Drink a glass of water',
          '5 minutes of breathing or short walk',
        ],
      },
    ];

    return this.getCommonViewData({
      routins: true,
      items: routins,
    });
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
