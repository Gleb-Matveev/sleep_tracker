import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal, Status } from './entities/goal.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { GoalsEventsService } from './goal.events';
import { S3bucketService } from 'src/s3bucket/s3bucket.service';

@Injectable()
export class GoalService {
  constructor(
    @InjectRepository(Goal)
    private goalRepository: Repository<Goal>,
    private goalEventsService: GoalsEventsService,
    private s3bucketService: S3bucketService,
  ) {}

  async create(
    createGoalDto: CreateGoalDto,
    file?: Express.Multer.File,
  ): Promise<Goal> {
    if (file) {
      const url = await this.s3bucketService.saveImage(file);
      createGoalDto.image_url = url;
    }

    const goal = this.goalRepository.create(createGoalDto);
    if (goal) {
      this.goalEventsService.emit({
        type: 'created',
        payload: { id: goal.id, title: goal.name },
      });
    }
    return this.goalRepository.save(goal);
  }

  async findAll(): Promise<Goal[]> {
    return await this.goalRepository.find();
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: Goal[]; total: number }> {
    const findOptions: FindManyOptions<Goal> = {
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.goalRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(id: number): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id } });

    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }

    return goal;
  }

  async update(
    id: number,
    updateGoalDto: UpdateGoalDto,
    file?: Express.Multer.File,
  ): Promise<Goal> {
    if (file) {
      const url = await this.s3bucketService.saveImage(file);
      updateGoalDto.image_url = url;
    }

    await this.goalRepository.update(id, updateGoalDto);
    const updated = await this.goalRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Goal with id ${id} not found`);
    }
    this.goalEventsService.emit({
      type: 'updated',
      payload: { id: updated.id, title: updated.name },
    });
    return updated;
  }

  async remove(id: number): Promise<Goal> {
    // TO DO: remove associeated image
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }

    await this.goalRepository.delete(id);
    this.goalEventsService.emit({
      type: 'deleted',
      payload: { id: goal.id, title: goal.name },
    });
    return goal;
  }

  async completeGoal(id: number): Promise<Goal> {
    const updatable = await this.goalRepository.findOne({ where: { id } });
    if (!updatable) {
      throw new Error(`Goal with id ${id} not found`);
    }
    const updateGoalDto: UpdateGoalDto = {
      status: Status.DONE,
    };
    await this.goalRepository.update(id, updateGoalDto);
    return {
      id: updatable.id,
      name: updatable.name,
      description: updatable.description,
      image_url: updatable.image_url,
      status: Status.DONE,
      user: updatable.user,
    };
  }

  async uncompleteGoal(id: number): Promise<Goal> {
    const updatable = await this.goalRepository.findOne({ where: { id } });
    if (!updatable) {
      throw new Error(`Goal with id ${id} not found`);
    }
    const updateGoalDto: UpdateGoalDto = {
      status: Status.NOTDONE,
    };
    await this.goalRepository.update(id, updateGoalDto);
    return {
      id: updatable.id,
      name: updatable.name,
      description: updatable.description,
      image_url: updatable.image_url,
      status: Status.NOTDONE,
      user: updatable.user,
    };
  }
}
