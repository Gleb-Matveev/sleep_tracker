import { Module } from '@nestjs/common';
import { RuleService } from './rule.service';
import { RuleController } from './rule.controller';
import { RuleApiController } from './rule-api.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './entities/rule.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rule]), CommonModule],
  controllers: [RuleController, RuleApiController],
  providers: [RuleService],
})
export class RuleModule {}
