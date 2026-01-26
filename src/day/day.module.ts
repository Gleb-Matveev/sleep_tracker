import { Module } from '@nestjs/common';
import { DayService } from './day.service';
import { DayController } from './day.controller';
import { DayApiController } from './day-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { DayRoutine } from './entities/day-routine.entity';
import { Routine } from 'src/routine/entities/routine.entity';
import { CommonModule } from '../common/common.module';
import { DayResolver } from './day.resolver';
import { DayAdapter } from './day.adapter';
import { DayCacheService } from './day-cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Day, DayRoutine, Routine]), CommonModule],
  controllers: [DayController, DayApiController],
  providers: [DayService, DayResolver, DayAdapter, DayCacheService],
})
export class DayModule {}
