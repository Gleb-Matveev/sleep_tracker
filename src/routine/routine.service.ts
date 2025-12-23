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

  findOne(id: number) {
    return `This action returns a #${id} routine`;
  }

  update(id: number, updateRoutineDto: UpdateRoutineDto) {
    return `This action updates a #${id} routine`;
  }

  remove(id: number) {
    return `This action removes a #${id} routine`;
  }
}
