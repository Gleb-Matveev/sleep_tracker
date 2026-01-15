import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Controller('api/rules')
export class RuleApiController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRuleDto: CreateRuleDto) {
    return await this.ruleService.create(createRuleDto);
  }

  @Get()
  async findAll() {
    return await this.ruleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const rule = await this.ruleService.findOne(+id);
    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }
    return rule;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto) {
    return await this.ruleService.update(+id, updateRuleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.ruleService.remove(+id);
  }
}
