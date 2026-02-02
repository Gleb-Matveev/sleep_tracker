import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';
import { SupertokensService } from './supertokens/supertokens.service';
import { supertokensConfig } from './supertokens.config';
import { GoalController } from 'src/goal/goal.controller';
import { RuleController } from 'src/rule/rule.controller';
import { RoutineController } from 'src/routine/routine.controller';
import { DayController } from 'src/day/day.controller';
import { AuthController } from './auth.controller';

@Module({
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    /*consumer
      .apply(RedirectIfNotLoggedInMiddleware)
      .forRoutes(DayController, GoalController, RuleController, RoutineController);*/
  }

  static forRoot(): DynamicModule {
    return {
      providers: [
        {
          useFactory: () => supertokensConfig(),
          provide: 'SUPERTOKEN-CONFIG',
        },
        SupertokensService,
      ],
      controllers: [AuthController],
      exports: [],
      imports: [],
      module: AuthModule,
    };
  }
}
