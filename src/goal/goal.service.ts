import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { GoalsEventsService } from './goal.events';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    private goalEventsService: GoalsEventsService
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const goal = this.goalRepository.create(createGoalDto);
    if (goal) {
      this.goalEventsService.emit({type: 'created', payload: {id: goal.id, title: goal.name}});
    }
    return this.goalRepository.save(goal);
  }

  async findAll(): Promise<Goal[]> {
    return await this.goalRepository.find();
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Goal[]; total: number }> {
    const findOptions: FindManyOptions<Goal> = {
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.goalRepository.findAndCount(findOptions);
    return { data, total };
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
    this.goalEventsService.emit({type: 'updated', payload: {id: updated.id, title: updated.name}});
    return updated;
  }

  async remove(id: number): Promise<void> {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }
    
    await this.goalRepository.delete(id);
    this.goalEventsService.emit({type: 'deleted', payload: {id: goal.id, title: goal.name}});
  }
}
