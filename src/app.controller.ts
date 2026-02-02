import { Controller, Get, Render, Query, Res } from '@nestjs/common';
import express from 'express';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from './auth/supertokens/public.decorator';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  @Render('login')
  login() {
  }

  @Public()
  @Get('register')
  @Render('register')
  register() {
  }

  /*@Get()
  redirect(@Res() res: express.Response) {
    res.redirect('/day');
  }*/

  /*@Get()
  @Render('index')
  root(@Query('auth') auth: string) {
    if (auth == 'auth') {
      return this.getCommonViewData({
        home: true,
        message: 'Track your sleep and wake up better every day 💤',
      });
    }
    return;
  }*/
}
