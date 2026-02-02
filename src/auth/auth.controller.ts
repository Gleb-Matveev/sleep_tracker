import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
//import { AuthService } from './auth.service';
//import { Public } from './decorators/public.decorator';
//import { AuthGuard } from './guards/auth.guard';
import type { Request, Response } from 'express';
import { UserService } from 'src/user/user.service';
import { Public } from './supertokens/public.decorator';
import { SupertokensService } from './supertokens/supertokens.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly supertokenService: SupertokensService,
    //private readonly userService: UserService,
  ) {}

  @Public()
  @Post('register')
  async signUp(
    @Body('email') email: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    console.log("Auth register");
    try {
      await this.supertokenService.createUser(email, password);
      console.log("Success");
      return res.redirect('/?success=registration_complete');
    } catch (error) {
      return res.redirect('/register?error=registration_failed');
    }
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
    //console.log("Auth login");
    try {
      const result = await this.supertokenService.signIn(email, password);
      if (result.status !== 'OK') {
        return res.render('login', { error: true });
      }
      await this.supertokenService.createSession(req, res, result.recipeUserId);
      console.log("Login result:", result);
      return res.redirect('/day');
    } catch (error) {
      return res.redirect('?error=invalid_credentials');
    }
  }

  /*@UseGuards(new AuthGuard())
  @Post('signout')
  @HttpCode(HttpStatus.OK)
  async signOut(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('User not found');
    }
    await this.authService.signOut(req.user.sessionHandle);
    return res.redirect('/login');
  }*/

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('confirmPassword') confirmPassword: string,
    @Res() res: Response,
  ) {
    try {
      /*const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        return res.redirect('/register?error=email_already_exists');
      }

      if (password !== confirmPassword) {
        return res.redirect('/register?error=passwords_do_not_match');
      }*/

      const result = await this.supertokenService.createUser(email, password);
      if (result.status === 'OK') {
        return res.redirect('/login?success=registration_complete');
      }
      return res.redirect(`/register?error=${result.status}`);
    } catch (error) {
      return res.redirect('/register?error=server_error');
    }
  }
}
