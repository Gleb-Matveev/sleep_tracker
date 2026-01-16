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
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto, @Res() res: Response) {
    await this.ruleService.create(createRuleDto);
    return res.redirect('/rule');
  }

  @Get()
  @Render('rule/rules')
  async findAll() {
    const rules = await this.ruleService.findAll();

    return {
      rules: true,
      items: rules,
    };
  }

  @Get('new')
  @Render('rule/new')
  newForm() {
    return { rules: true };
  }

  @Get(':id/edit')
  @Render('rule/edit')
  async editForm(@Param('id') id: string) {
    const rule = await this.ruleService.findOne(+id);
    if (!rule) {
      throw new Error(`Rule with id ${id} not found`);
    }
    return {
      rules: true,
      rule: {
        id: rule.id,
        name: rule.name,
        description: rule.description,
      },
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto, @Res() res: Response) {
    await this.ruleService.update(+id, updateRuleDto);
    return res.redirect('/rule');
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ruleService.remove(+id);
  }
}
