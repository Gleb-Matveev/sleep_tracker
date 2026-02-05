import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Rule } from './entities/rule.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
  ) {}

  async create(createRuleDto: CreateRuleDto, userId: number): Promise<Rule> {
    const rule = this.ruleRepository.create({ ...createRuleDto, userId });
    return await this.ruleRepository.save(rule);
  }

  async findAll(userId: number): Promise<Rule[]> {
    const res = await this.ruleRepository.find({
      where: {
        userId: userId
      }
    });

    return res;
  }

  async findAllPaginated(
    page: number,
    limit: number,
    userId: number
  ): Promise<{ data: Rule[]; total: number }> {
    const findOptions: FindManyOptions<Rule> = {
      where: {
        userId: userId
      },
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.ruleRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(
    id: number,
    userId: number
  ): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({ where: { id, userId } });

    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }

    return rule;
  }

  async update(
    id: number, 
    updateRuleDto: UpdateRuleDto,
    userId: number
  ): Promise<Rule> {
    await this.ruleRepository.update({ id, userId }, updateRuleDto);

    const updated = await this.ruleRepository.findOne({ where: { id, userId } });
    if (!updated) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }

    return updated;
  }

  async remove(
    id: number,
    userId: number
  ): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({ where: { id, userId } });

    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }
    
    await this.ruleRepository.delete({ id, userId });
    return rule;
  }
}
