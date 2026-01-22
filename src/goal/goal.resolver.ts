import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Goal, Status } from './entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalAdapter } from './goal.adapter';
import { GoalModel } from './models/goal.model';
import { CreateGoalInput } from './inputs/create-goal.input';
import { UpdateGoalInput } from './inputs/update-goal.input';

@Resolver(() => GoalModel)
export class GoalResolver {
  constructor(
    private readonly goalAdapter: GoalAdapter,
    private readonly goalService: GoalService,
  ) {}

  @Mutation(() => GoalModel, {
    name: 'createGoal',
    description: 'Create new goal',
  })
  async create(
    @Args('createGoalInput') createGoalInput: CreateGoalInput,
  ): Promise<GoalModel> {
    const goal = await this.goalService.create(this.goalAdapter.toCreateDto(createGoalInput));
    return this.goalAdapter.toModel(goal);
  }

  @Query(() => [GoalModel], { name: 'goals' })
  async findAll(): Promise<GoalModel[]> {
    const goals = await this.goalService.findAll();
    const goalsModel: GoalModel[] = goals.map((goal) => {
      return this.goalAdapter.toModel(goal);
    });
    return goalsModel;
  }

  @Query(() => GoalModel, { name: 'goal' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<GoalModel> {
    const goal = await this.goalService.findOne(id);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel)
  async updateGoal(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateGoalInput') updateGoalInput: UpdateGoalInput,
  ) {
    const goal = await this.goalService.update(id, this.goalAdapter.toUpdateDto(updateGoalInput));
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel)
  async removeGoal(@Args('id', { type: () => Int }) id: number) {
    const goal = await this.goalService.remove(id);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel)
  async completeGoal(@Args('id', { type: () => Int }) id: number): Promise<GoalModel> {
    const goal = await this.goalService.completeGoal(id);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel)
  async uncompleteGoal(@Args('id', { type: () => Int }) id: number): Promise<GoalModel> {
    const goal = await this.goalService.uncompleteGoal(id);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }
}
