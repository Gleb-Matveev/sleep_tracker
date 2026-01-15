import { Injectable } from '@nestjs/common';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { Repository } from 'typeorm';

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

  async findOne(id: number): Promise<Routine | null> {
    return await this.routineRepository.findOne({ 
      where: { id },
      relations: {
        days: {
          day: true,
        },
      },
    });
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

  async remove(id: number): Promise<void> {
    await this.routineRepository.delete(id);
  }
}
