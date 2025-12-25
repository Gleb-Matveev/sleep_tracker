import { Injectable } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
  ) {}

  async create(createDayDto: CreateDayDto): Promise<Day> {
    const day = this.dayRepository.create({
      ...createDayDto,
      getup_score: Number(createDayDto.getup_score),
      feeling_score: Number(createDayDto.feeling_score),
      date: new Date(createDayDto.date),
    });

    return this.dayRepository.save(day);
  }

  async findAll(): Promise<Day[]> {
    return await this.dayRepository.find();
  }

  async findOne(id: number): Promise<Day | null> {
    return await this.dayRepository.findOne({ where: { id } });
  }

  async update(id: number, updateDayDto: UpdateDayDto): Promise<Day> {
    await this.dayRepository.update(id, {
      ...updateDayDto,
      getup_score: updateDayDto.getup_score !== undefined ? Number(updateDayDto.getup_score) : undefined,
      feeling_score: updateDayDto.feeling_score !== undefined ? Number(updateDayDto.feeling_score) : undefined,
      date: updateDayDto.date ? new Date(updateDayDto.date) : undefined,
    });
    const updated = await this.dayRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Day with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.dayRepository.delete(id);
  }
}
