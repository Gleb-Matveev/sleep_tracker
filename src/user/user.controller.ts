import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Public } from 'src/auth/supertokens/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Public()
  @Get()
  async findAll() {
    return await this.userService.findAll();
  }
}
