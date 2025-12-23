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

  findOne(id: number) {
    return `This action returns a #${id} day`;
  }

  update(id: number, updateDayDto: UpdateDayDto) {
    return `This action updates a #${id} day`;
  }

  remove(id: number) {
    return `This action removes a #${id} day`;
  }
}
