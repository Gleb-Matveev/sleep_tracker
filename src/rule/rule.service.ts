import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Rule } from './entities/rule.entity';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>,
  ) {}

  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const rule = this.ruleRepository.create(createRuleDto);
    return this.ruleRepository.save(rule);
  }

  async findAll(): Promise<Rule[]> {
    return await this.ruleRepository.find();
  }

  async findAllPaginated(page: number, limit: number): Promise<{ data: Rule[]; total: number }> {
    const findOptions: FindManyOptions<Rule> = {
      order: { name: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [data, total] = await this.ruleRepository.findAndCount(findOptions);
    return { data, total };
  }

  async findOne(id: number): Promise<Rule | null> {
    return await this.ruleRepository.findOne({ where: { id } });
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    await this.ruleRepository.update(id, updateRuleDto);
    const updated = await this.ruleRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Rule with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<void> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }
    await this.ruleRepository.delete(id);
  }
}
