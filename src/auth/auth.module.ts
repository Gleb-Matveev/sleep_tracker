import {
  MiddlewareConsumer,
  Module,
  NestModule,
  DynamicModule,
} from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';
import { SupertokensService } from './supertokens/supertokens.service';
import { supertokensConfig } from './supertokens/supertokens.config';
import { AuthController } from './auth.controller';
import { RequireAuthMiddleware } from './requireauth.middleware';
import { UserModule } from 'src/user/user.module';
import { DayModule } from 'src/day/day.module';
import { S3bucketModule } from 'src/s3bucket/s3bucket.module';

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
    consumer
      .apply(RequireAuthMiddleware)
      .exclude(
        '/',
        '/register',
        'auth/login',
        'auth/register',
      )
      .forRoutes('*');
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
      imports: [UserModule, DayModule, S3bucketModule],
      module: AuthModule,
    };
  }
}
