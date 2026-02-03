import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { RuleModel } from './models/rule.model';
import { RuleService } from './rule.service'
import { CreateRuleInput } from './inputs/create-rule.input';
import { UpdateRuleInput } from './inputs/update-rule.input';
import { RuleAdapter } from './rule.adapter';
import { GQLUserId } from 'src/auth/decorators/user-id-ql.decorator';

@Resolver(() => RuleModel)
export class RuleResolver {
  constructor(
    private readonly ruleAdapter: RuleAdapter,
    private readonly ruleService: RuleService,
  ) {}

  @Mutation(() => RuleModel, {
    name: 'createRule',
    description: 'Create new Rule',
  })
  async create(
    @Args('createRuleInput') createRuleInput: CreateRuleInput,
    @GQLUserId() userId: number
  ): Promise<RuleModel> {
    const rule = await this.ruleService.create(this.ruleAdapter.toCreateDto(createRuleInput), userId);
    return this.ruleAdapter.toModel(rule);
  }

  @Query(() => [RuleModel], { name: 'rules' })
  async findAll(
    @GQLUserId() userId: number
  ): Promise<RuleModel[]> {
    const rules = await this.ruleService.findAll(userId);
    const rulesModel: RuleModel[] = rules.map((rule) => {
      return this.ruleAdapter.toModel(rule);
    });
    return rulesModel;
  }

  @Query(() => RuleModel, { name: 'rule' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ): Promise<RuleModel> {
    const rule = await this.ruleService.findOne(id, userId);
    const ruleModel = this.ruleAdapter.toModel(rule);
    return ruleModel;
  }

  @Mutation(() => RuleModel)
  async updateRule(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRuleInput') updateRuleInput: UpdateRuleInput,
    @GQLUserId() userId: number
  ) {
    const rule = await this.ruleService.update(id, this.ruleAdapter.toUpdateDto(updateRuleInput), userId);
    const ruleModel = this.ruleAdapter.toModel(rule);
    return ruleModel;
  }

  @Mutation(() => RuleModel)
  async removeRule(
    @Args('id', { type: () => Int }) id: number, 
    @GQLUserId() userId: number
  ) {
    const rule = await this.ruleService.remove(id, userId);
    const ruleModel = this.ruleAdapter.toModel(rule);
    return ruleModel;
  }
}
