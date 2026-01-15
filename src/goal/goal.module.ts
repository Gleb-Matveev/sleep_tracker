import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { GoalApiController } from './goal-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalsEventsService } from './goal.events';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), CommonModule],
  controllers: [GoalController, GoalApiController],
  providers: [GoalService, GoalsEventsService],
})
export class GoalModule {}
