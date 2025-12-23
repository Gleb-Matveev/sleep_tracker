import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.ruleService.create(createRuleDto);
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
