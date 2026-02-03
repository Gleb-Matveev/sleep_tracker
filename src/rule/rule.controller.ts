import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  Header,
  UseInterceptors,
} from '@nestjs/common';
import { RuleService } from './rule.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { RuleResponseDto } from './dto/rule-response.dto';
import { EtagInterceptor } from 'src/common/etag.interceptor';
import { UserId } from 'src/auth/decorators/userid.decorator';

@ApiExcludeController()
@Controller('rule')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Post()
  async create(
    @Body() createRuleDto: CreateRuleDto,
    @UserId() userId: number
  ) {
    await this.ruleService.create(createRuleDto, userId);
  }

  @Get()
  @Render('rule/rules')
  async findAll(
    @UserId() userId: number
  ): Promise<{ rules: boolean; items: RuleResponseDto[]}> {
    const rules = await this.ruleService.findAll(userId);

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

  @Get('cached')
  @UseInterceptors(EtagInterceptor)
  @Header('Cache-Control', 'max-age=3600')
  async findAllCached(
    @UserId() userId: number
  ): Promise<RuleResponseDto[]> {
    const rules = await this.ruleService.findAll(userId);

    const rulesDto: RuleResponseDto[] = rules.map((rule) => ({
      id: rule.id,
      name: rule.name,
      description: rule.description,
    }));

    return rulesDto;
  }

  @Patch(':id')
  async update(@
    Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto,
    @UserId() userId: number
  ) {
    await this.ruleService.update(+id, updateRuleDto, userId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserId() userId: number
  ) {
    return this.ruleService.remove(+id, userId);
  }

  @Get('new')
  @Render('rule/new')
  newForm(): { rules: boolean } {
    return { rules: true };
  }

  @Get(':id/edit')
  @Render('rule/edit')
  async editForm(
    @Param('id') id: string,
    @UserId() userId: number
  ): Promise<{ rules: boolean; rule: RuleResponseDto }> {
    const rule = await this.ruleService.findOne(+id, userId);
    
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
