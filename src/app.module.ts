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

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req, res }) => ({ req, res }),
    }),
    DatabaseModule,
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
