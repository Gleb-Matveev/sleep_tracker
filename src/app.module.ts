import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';
import { DayModule } from './day/day.module';
import { GoalModule } from './goal/goal.module';
import { RoutineModule } from './routine/routine.module';
import { RuleModule } from './rule/rule.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    RuleModule,
    GoalModule,
    RoutineModule,
    DayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
