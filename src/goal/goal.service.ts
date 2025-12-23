import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>, 
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create(createGoalDto);
    return this.goalRepository.save(goal);
  }

  async findAll(): Promise<Goal[]> {
    return await this.goalRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} goal`;
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    return `This action updates a #${id} goal`;
  }

  async remove(id: number): Promise<void> {
    await this.goalRepository.delete(id);
  }
}
