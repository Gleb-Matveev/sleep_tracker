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
import { RuleResponseDto } from './dto/rule-response.dto';

@ApiExcludeController()
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto) {
    await this.ruleService.create(createRuleDto);
  }

  @Get()
  @Render('rule/rules')
  async findAll(): Promise<{ rules: boolean; items: RuleResponseDto[]}> {
    const rules = await this.ruleService.findAll();

    const rulesDto: RuleResponseDto[] = rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
    }));

    return {
      rules: true,
      items: rulesDto,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    await this.ruleService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ruleService.remove(+id);
  }

  @Get('new')
  @Render('rule/new')
  newForm(): { rules: boolean } {
    return { rules: true };
  }

  @Get(':id/edit')
  @Render('rule/edit')
  async editForm(@Param('id') id: string): Promise<{ rules: boolean; rule: RuleResponseDto }> {
    const rule = await this.ruleService.findOne(+id);
    
    if (!rule) {
      throw new Error(`Rule with id ${id} not found`);
    }

    const ruleDto: RuleResponseDto = {
      id: rule.id,
      name: rule.name,
      description: rule.description,
    };

    return {
      rules: true,
      rule: ruleDto,
    };
  }
}
