import { Controller, Get, Render, Query } from '@nestjs/common';
import { AppService } from './app.service';

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
  @Render('index')
  root(@Query('auth') auth: string) {
    if (auth == 'auth') {
      return this.getCommonViewData({
        home: true,
        message: 'Track your sleep and wake up better every day 💤',
      });
    }
    return;
  }
}
