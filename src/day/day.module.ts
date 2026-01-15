import { Module } from '@nestjs/common';
import { DayService } from './day.service';
import { DayController } from './day.controller';
import { DayApiController } from './day-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Day } from './entities/day.entity';
import { DayRoutine } from './entities/day-routine.entity';
import { Routine } from 'src/routine/entities/routine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Day, DayRoutine, Routine])],
  controllers: [DayController, DayApiController],
  providers: [DayService],
})
export class DayModule {}
