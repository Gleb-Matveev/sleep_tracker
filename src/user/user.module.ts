import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserApiController } from './user.api-controller';
import { UserAdapter } from './user.adapter';
import { CommonModule } from 'src/common/common.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CommonModule],
  controllers: [UserController, UserApiController],
  providers: [UserService, UserAdapter, UserResolver],
  exports: [UserService],
})
export class UserModule {}
