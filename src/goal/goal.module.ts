import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { GoalController } from './goal.controller';
import { GoalApiController } from './goal-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { GoalsEventsService } from './goal.events';
import { CommonModule } from '../common/common.module';
import { GoalResolver } from './goal.resolver';
import { GoalAdapter } from './goal.adapter';
import { S3bucketModule } from 'src/s3bucket/s3bucket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Goal]), CommonModule, S3bucketModule],
  controllers: [GoalController, GoalApiController],
  providers: [GoalService, GoalsEventsService, GoalResolver, GoalAdapter],
})
export class GoalModule {}
