import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { Repository } from 'typeorm';
import { DayRoutine } from './entities/day-routine.entity';
import { Routine } from 'src/routine/entities/routine.entity';
import { FindManyOptions } from 'typeorm';
import { DayCacheService } from './day-cache.service';

@Injectable()
export class DayService {
  constructor(
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(DayRoutine)
    private dayRoutineRepository: Repository<DayRoutine>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @Inject()
    private readonly dayCacheService: DayCacheService,
  ) {}

  async create(
    createDayDto: CreateDayDto,
    userId: number
  ): Promise<Day> {
    await this.dayCacheService.invalidateDays();
    let saved;
    const day = this.dayRepository.create({
        ...createDayDto,
        getup_score: Number(createDayDto.getup_score),
        feeling_score: Number(createDayDto.feeling_score),
        date: new Date(createDayDto.date),
        routines: createDayDto.routineIds.map((id) =>
          this.dayRoutineRepository.create({
            routine: { id },
          }),
        ),
        userId,
      });

    try {
      saved = await this.dayRepository.save(day);
    } catch (e) {
      throw new NotFoundException("Specified session's ids werent found");
    }

    return saved;
  }

  async findAll(
    userId: number
  ): Promise<Day[]> {
    let days = await this.dayCacheService.getDays();
    if (days) {
      console.log('Returned cached days');
      return days;
    }

    days = await this.dayRepository.find({
      where: {
        userId
      },
      relations: {
        routines: {
          routine: true,
        },
      },
      order: { date: 'DESC' },
    });
    await this.dayCacheService.saveDays(days);

    return days;
  }

  async findAllPaginated(
    page: number,
    limit: number,
    userId: number
  ): Promise<{ data: Day[]; total: number }> {
    const findOptions: FindManyOptions<Day> = {
      where: {
        userId
      },
      relations: {
        routines: {
          routine: true,
        },
      },
      order: { date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.dayRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(
    id: number,
    userId: number
  ): Promise<Day> {
    const day = await this.dayRepository.findOne({
      where: { id, userId },
      relations: {
        routines: {
          routine: true,
        },
      },
    });

    if (!day) {
      throw new NotFoundException(`Day with id ${id} not found`);
    }

    return day;
  }

  async update(
    id: number,
    updateDayDto: UpdateDayDto,
    userId: number
  ): Promise<Day> {
    await this.dayCacheService.invalidateDays();
    try {
      await this.dayRepository.save({
        id,
        ...updateDayDto,
        getup_score:
          updateDayDto.getup_score !== undefined
            ? Number(updateDayDto.getup_score)
            : undefined,
        feeling_score:
          updateDayDto.feeling_score !== undefined
            ? Number(updateDayDto.feeling_score)
            : undefined,
        date: updateDayDto.date ? new Date(updateDayDto.date) : undefined,
        routines:
          updateDayDto.routineIds !== undefined
            ? updateDayDto.routineIds.map((id) =>
                this.dayRoutineRepository.create({ routine: { id } }),
              )
            : undefined,
        userId
      });
    } catch (e) {
      throw new NotFoundException("Specified session's ids werent found");
    }
    const updated = await this.dayRepository.findOne({ where: { id, userId } });

    if (!updated) {
      throw new Error(`Day with id ${id} not found`);
    }

    return updated;
  }

  async remove(
    id: number,
    userId: number
  ): Promise<Day> {
    await this.dayCacheService.invalidateDays();
    const day = await this.dayRepository.findOne({
      where: { id, userId },
      relations: {
        routines: {
          routine: true,
        },
      },
    });

    if (!day) {
      throw new NotFoundException(`Day with id ${id} not found`);
    }

    await this.dayRepository.delete({id, userId});
    return day;
  }

  async findAllRoutines(
    userId: number
  ): Promise<Routine[]> {
    return await this.routineRepository.find({where: {userId}});
  }
}
