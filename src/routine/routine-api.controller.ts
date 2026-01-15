import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { RoutineService } from './routine.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Controller('api/routines')
export class RoutineApiController {
  constructor(private readonly routineService: RoutineService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoutineDto: CreateRoutineDto) {
    return await this.routineService.create(createRoutineDto);
  }

  @Get()
  async findAll() {
    return await this.routineService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const routine = await this.routineService.findOne(+id);
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoutineDto: UpdateRoutineDto,
  ) {
    return await this.routineService.update(+id, updateRoutineDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.routineService.remove(+id);
  }

  // Получить все дни для конкретной рутины
  @Get(':id/days')
  async getRoutineDays(@Param('id') id: string) {
    const routine = await this.routineService.findOne(+id);
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    return routine.days?.map((dr) => dr.day) || [];
  }

  // Получить конкретный день для рутины
  @Get(':routineId/days/:dayId')
  async getRoutineDay(
    @Param('routineId') routineId: string,
    @Param('dayId') dayId: string,
  ) {
    const routine = await this.routineService.findOne(+routineId);
    if (!routine) {
      throw new NotFoundException(`Routine with id ${routineId} not found`);
    }
    const day = routine.days?.find((dr) => dr.day.id === +dayId)?.day;
    if (!day) {
      throw new NotFoundException(
        `Day with id ${dayId} not found for routine ${routineId}`,
      );
    }
    return day;
  }
}
