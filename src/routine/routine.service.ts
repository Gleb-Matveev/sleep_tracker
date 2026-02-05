import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Routine, RoutinePeriod } from './entities/routine.entity';
import { Repository, FindManyOptions } from 'typeorm';
import { UserId } from 'src/auth/decorators/userid.decorator';
import { DayCacheService } from 'src/day/day-cache.service';

@Injectable()
export class RoutineService {
  constructor(
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    private readonly dayCacheService: DayCacheService,
  ) {}

  async create(
    createRoutineDto: CreateRoutineDto,
    userId: number,
  ): Promise<Routine> {
    this.dayCacheService.invalidateDays();
    const routine = this.routineRepository.create({...createRoutineDto, userId});
    return await this.routineRepository.save(routine);
  }

  async findAll(
    userId: number
  ): Promise<Routine[]> {
    return await this.routineRepository.find({ where: { userId }});
  }

  async findAllPaginated(
    page: number,
    limit: number,
    userId: number
  ): Promise<{ data: Routine[]; total: number }> {
    const findOptions: FindManyOptions<Routine> = {
      where: { 
        userId 
      },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] =
      await this.routineRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(
    id: number,
    userId: number
  ): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id, userId },
      relations: {
        days: {
          day: true,
        },
      },
    });

    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }

    return routine;
  }

  async update(
    id: number,
    updateRoutineDto: UpdateRoutineDto,
    userId: number
  ): Promise<Routine> {
    this.dayCacheService.invalidateDays();
    const steps = Array.isArray(updateRoutineDto.steps)
      ? updateRoutineDto.steps.map((s) => s.trim()).filter(Boolean)
      : undefined;

    await this.routineRepository.update({id, userId}, {
      ...updateRoutineDto,
      steps,
    });
    const updated = await this.routineRepository.findOne({ where: { id, userId } });
    if (!updated) {
      throw new Error(`Routine with id ${id} not found`);
    }
    return updated;
  }

  async remove(
    id: number,
    userId: number
  ): Promise<Routine> {
    this.dayCacheService.invalidateDays();
    const routine = await this.routineRepository.findOne({ where: { id, userId } });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    await this.routineRepository.delete({id, userId});
    return routine;
  }

  async addSteps(
    id: number,
    new_steps: string[],
    userId: number
  ): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id, userId },
    });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }

    const steps_to_add: string[] = Array.isArray(new_steps)
      ? new_steps.map((s) => s.trim()).filter(Boolean)
      : [];

    const steps = [...routine.steps, ...steps_to_add];

    await this.routineRepository.update({id, userId}, {
      steps,
    });
    return {
      ...routine,
      steps,
    };
  }

  async changePeriod(
    id: number,
    userId: number
  ): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id, userId },
    });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }

    const period =
      routine.period == RoutinePeriod.DAY
        ? RoutinePeriod.NIGHT
        : RoutinePeriod.DAY;
    await this.routineRepository.update({id, userId}, {
      period:
        routine.period == RoutinePeriod.DAY
          ? RoutinePeriod.NIGHT
          : RoutinePeriod.DAY,
    });
    return {
      ...routine,
      period,
    };
  }
}
