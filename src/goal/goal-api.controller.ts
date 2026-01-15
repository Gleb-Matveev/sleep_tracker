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
import { GoalService } from './goal.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Controller('api/goals')
export class GoalApiController {
  constructor(private readonly goalService: GoalService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createGoalDto: CreateGoalDto) {
    return await this.goalService.create(createGoalDto);
  }

  @Get()
  async findAll() {
    return await this.goalService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const goal = await this.goalService.findOne(+id);
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }
    return goal;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto) {
    return await this.goalService.update(+id, updateGoalDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.goalService.remove(+id);
  }
}
