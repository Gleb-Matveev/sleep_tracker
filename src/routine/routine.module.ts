import { Module } from '@nestjs/common';
import { RoutineService } from './routine.service';
import { RoutineController } from './routine.controller';
import { RoutineApiController } from './routine-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Routine } from './entities/routine.entity';
import { CommonModule } from '../common/common.module';
import { RoutineResolver } from './routine.resolver';
import { RoutineAdapter } from './routine.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([Routine]), CommonModule],
  controllers: [RoutineController, RoutineApiController],
  providers: [RoutineService, RoutineResolver, RoutineAdapter],
})
export class RoutineModule {}
