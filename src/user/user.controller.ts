import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { UserRole } from './entities/user.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Roles(UserRole.ADMIN)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Public()
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
