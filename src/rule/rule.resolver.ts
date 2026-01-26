import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { RuleModel } from './models/rule.model';
import { RuleService } from './rule.service'
import { CreateRuleInput } from './inputs/create-rule.input';
import { UpdateRuleInput } from './inputs/update-rule.input';
import { RuleAdapter } from './rule.adapter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Resolver(() => RuleModel)
export class RuleResolver {
  constructor(
    private readonly ruleAdapter: RuleAdapter,
    private readonly ruleService: RuleService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  @Mutation(() => RuleModel, {
    name: 'createRule',
    description: 'Create new Rule',
  })
  async create(
    @Args('createRuleInput') createRuleInput: CreateRuleInput,
  ): Promise<RuleModel> {
    await this.invalidateCollectionCache();
    const rule = await this.ruleService.create(this.ruleAdapter.toCreateDto(createRuleInput));
    return this.ruleAdapter.toModel(rule);
  }

  @Query(() => [RuleModel], { name: 'rules' })
  async findAll(): Promise<RuleModel[]> {
    const rules = await this.ruleService.findAll();
    const rulesModel: RuleModel[] = rules.map((rule) => {
      return this.ruleAdapter.toModel(rule);
    });
    return rulesModel;
  }

  @Query(() => RuleModel, { name: 'rule' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<RuleModel> {
    await this.invalidateCollectionCache();
    const rule = await this.ruleService.findOne(id);
    const ruleModel = this.ruleAdapter.toModel(rule);
    return ruleModel;
  }

  @Mutation(() => RuleModel)
  async updateRule(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRuleInput') updateRuleInput: UpdateRuleInput,
  ) {
    await this.invalidateCollectionCache();
    const rule = await this.ruleService.update(id, this.ruleAdapter.toUpdateDto(updateRuleInput));
    const ruleModel = this.ruleAdapter.toModel(rule);
    return ruleModel;
  }

  @Mutation(() => RuleModel)
  async removeRule(@Args('id', { type: () => Int }) id: number) {
    await this.invalidateCollectionCache();
    const rule = await this.ruleService.remove(id);
    const ruleModel = this.ruleAdapter.toModel(rule);
    return ruleModel;
  }

  async invalidateCollectionCache() {
    await this.cacheManager.del('findall');
  }
}
