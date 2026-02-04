import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  Session,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public } from './decorators/public.decorator';
import { SupertokensService } from './supertokens/supertokens.service';
import { DayCacheService } from 'src/day/day-cache.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('auth')
export class AuthController {
  constructor(
    private readonly supertokenService: SupertokensService,
    private readonly dayCacheService: DayCacheService,
  ) {}

  @Public()
  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.supertokenService.createUser(email, password, file);
    return res.redirect('/?success=registration_complete');
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const result = await this.supertokenService.signIn(email, password);
    if (result.status !== 'OK') {
      return res.redirect('/');
    }
    await this.supertokenService.createSession(req, res, result.recipeUserId);
    console.log("HERE");
    return res.redirect('/day');
  }

  @Post('signoutc')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    const session = await this.supertokenService.getSession(req, res);
    if (session) {
      await session.revokeSession();
      this.dayCacheService.invalidateDays();
    }
    return res.redirect('/');
  }
}
