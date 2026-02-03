import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './user/user.module';
import { DayModule } from './day/day.module';
import { GoalModule } from './goal/goal.module';
import { RoutineModule } from './routine/routine.module';
import { RuleModule } from './rule/rule.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { S3bucketModule } from './s3bucket/s3bucket.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 5,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }), // "request.credentials": "include" for pesochnica
    DatabaseModule,
    UserModule,
    RuleModule,
    S3bucketModule,
    GoalModule,
    RoutineModule,
    DayModule,
    AuthModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
})
export class AppModule {}
