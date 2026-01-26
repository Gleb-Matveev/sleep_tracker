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
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    await this.invalidateCollectionCache();
    const rule = this.ruleRepository.create(createRuleDto);
    return this.ruleRepository.save(rule);
  }

  async findAll(): Promise<Rule[]> {
    let res = await this.cacheManager.get<Rule[]>('findall');
    if (res) {
      console.log("Returned cached");
      return res;
    }

    res = await this.ruleRepository.find()
    await this.cacheManager.set('findall', res, 0);

    return res;
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

  async findOne(id: number): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({ where: { id } });

    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }

    return rule;
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    await this.invalidateCollectionCache();
    await this.ruleRepository.update(id, updateRuleDto);
    const updated = await this.ruleRepository.findOne({ where: { id } });
    if (!updated) {
      throw new Error(`Rule with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<Rule> {
    await this.invalidateCollectionCache();
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Rule with id ${id} not found`);
    }
    await this.ruleRepository.delete(id);
    return rule;
  }

  async invalidateCollectionCache() {
    await this.cacheManager.del('findall');
  }
}
