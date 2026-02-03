import { Controller, Get, Render, Query, Res } from '@nestjs/common';
import express from 'express';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorator';

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
}
