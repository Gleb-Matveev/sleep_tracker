import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Res,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import type { Response } from 'express';

@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto, @Res() res: Response) {
    await this.ruleService.create(createRuleDto);
    return res.redirect('/rule');
  }

  @Get()
  @Render('rules')
  async findAll() {
    /*const rules = [
      {
        title: 'Keep a stable sleep schedule',
        description:
          'Go to bed and wake up at the same time, even on weekends.',
      },
      {
        title: 'Create a calm sleeping environment',
        description: 'Dark, cool room without loud noises or bright lights.',
      },
    ];*/
    const rules = await this.ruleService.findAll();

    return {
      rules: true,
      items: rules,
    };
  }

  @Get('new')
  @Render('rule-new')
  newForm() {
    return { rules: true };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ruleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return this.ruleService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ruleService.remove(+id);
  }
}
