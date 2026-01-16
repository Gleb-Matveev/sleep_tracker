import { Controller, Get, Render, Query, Res } from '@nestjs/common';
import express from 'express';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  private getCommonViewData(extra: Record<string, unknown> = {}) {
    return {
      year: new Date().getFullYear(),
      ...extra,
    };
  }

  @Get()
  redirect(@Res() res: express.Response) {
    res.redirect('/day');
  }

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
