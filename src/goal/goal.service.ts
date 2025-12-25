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

  async findOne(id: number): Promise<Goal | null> {
    return await this.goalRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    await this.goalRepository.update(id, updateGoalDto);
    const updated = await this.goalRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Goal with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.goalRepository.delete(id);
  }
}
