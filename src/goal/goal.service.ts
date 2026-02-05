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
    userId: number,
    file?: Express.Multer.File,
  ): Promise<Goal> {
    if (file) {
      const url = await this.s3bucketService.saveImage(file);
      createGoalDto.image_url = url;
    }

    const goal = this.goalRepository.create({ ...createGoalDto, userId});
    if (goal) {
      this.goalEventsService.emit({
        type: 'created',
        payload: { id: goal.id, title: goal.name },
      });
    }
    return await this.goalRepository.save(goal);
  }

  async findAll(
    userId: number,
  ): Promise<Goal[]> {
    return await this.goalRepository.find({ where: { userId }});
  }

  async findAllPaginated(
    page: number,
    limit: number,
    userId: number
  ): Promise<{ data: Goal[]; total: number }> {
    const findOptions: FindManyOptions<Goal> = {
      where: {
        userId
      },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.goalRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(
    id: number,
    userId: number
  ): Promise<Goal> {
    const goal = await this.goalRepository.findOne({ where: { id, userId } });

    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }

    return goal;
  }

  async update(
    id: number,
    updateGoalDto: UpdateGoalDto,
    userId: number,
    file?: Express.Multer.File,
  ): Promise<Goal> {
    if (file) {
      const url = await this.s3bucketService.saveImage(file);
      updateGoalDto.image_url = url;
    }

    await this.goalRepository.update({ id, userId }, updateGoalDto);
    const updated = await this.goalRepository.findOne({ where: { id, userId } });
    if (!updated) {
      throw new Error(`Goal with id ${id} not found`);
    }
    this.goalEventsService.emit({
      type: 'updated',
      payload: { id: updated.id, title: updated.name },
    });
    return updated;
  }

  async remove(
    id: number,
    userId: number
  ): Promise<Goal> {
    // TO DO: remove associeated image
    const goal = await this.goalRepository.findOne({ where: { id, userId } });
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }

    await this.goalRepository.delete({id, userId});
    this.goalEventsService.emit({
      type: 'deleted',
      payload: { id: goal.id, title: goal.name },
    });
    return goal;
  }

  async completeGoal(
    id: number,
    userId: number
  ): Promise<Goal> {
    const updatable = await this.goalRepository.findOne({ where: { id, userId } });
    if (!updatable) {
      throw new Error(`Goal with id ${id} not found`);
    }
    const updateGoalDto: UpdateGoalDto = {
      status: Status.DONE,
    };
    await this.goalRepository.update({id, userId}, updateGoalDto);
    return {
      id: updatable.id,
      name: updatable.name,
      description: updatable.description,
      image_url: updatable.image_url,
      status: Status.DONE,
      userId: updatable.userId,
      user: updatable.user,
    };
  }

  async uncompleteGoal(
    id: number,
    userId: number
  ): Promise<Goal> {
    const updatable = await this.goalRepository.findOne({ where: {id, userId} });
    if (!updatable) {
      throw new Error(`Goal with id ${id} not found`);
    }
    const updateGoalDto: UpdateGoalDto = {
      status: Status.NOTDONE,
    };
    await this.goalRepository.update({id, userId}, updateGoalDto);
    return {
      id: updatable.id,
      name: updatable.name,
      description: updatable.description,
      image_url: updatable.image_url,
      status: Status.NOTDONE,
      userId: updatable.userId,
      user: updatable.user,
    };
  }
}
