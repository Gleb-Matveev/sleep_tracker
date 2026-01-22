import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Routine, RoutinePeriod } from './entities/routine.entity';
import { Repository, FindManyOptions } from 'typeorm';

@Injectable()
export class RoutineService {

  constructor(
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>
  ) {}

  async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const routine = this.routineRepository.create(createRoutineDto);
    return this.routineRepository.save(routine);
  }

  async findAll(): Promise<Routine[]> {
    return await this.routineRepository.find();
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Routine[]; total: number }> {
    const findOptions: FindManyOptions<Routine> = {
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.routineRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(id: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({ 
      where: { id },
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

  async update(id: number, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
    const steps = Array.isArray(updateRoutineDto.steps)
      ? updateRoutineDto.steps.map((s) => s.trim()).filter(Boolean)
      : undefined;
    
    await this.routineRepository.update(id, {
      ...updateRoutineDto,
      steps,
    });
    const updated = await this.routineRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Routine with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({ where: { id } });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }
    await this.routineRepository.delete(id);
    return routine;
  }

  async addSteps(id: number, new_steps: string[]): Promise<Routine> {
    const routine = await this.routineRepository.findOne({ 
      where: { id },
    });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }

    const steps_to_add: string[] = Array.isArray(new_steps)
      ? new_steps.map((s) => s.trim()).filter(Boolean)
      : [];
    
    const steps = [...routine.steps, ...steps_to_add];
    
    await this.routineRepository.update(id, {
      steps,
    });
    return {
      ...routine,
      steps
    };
  }

  async changePeriod(id: number): Promise<Routine> {
    const routine = await this.routineRepository.findOne({ 
      where: { id },
    });
    if (!routine) {
      throw new NotFoundException(`Routine with id ${id} not found`);
    }

    const period = routine.period == RoutinePeriod.DAY ? RoutinePeriod.NIGHT : RoutinePeriod.DAY
    await this.routineRepository.update(id, {
      period: routine.period == RoutinePeriod.DAY ? RoutinePeriod.NIGHT : RoutinePeriod.DAY
    });
    return {
      ...routine,
      period
    };
  }
}
