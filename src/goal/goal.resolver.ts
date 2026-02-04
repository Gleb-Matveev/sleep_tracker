import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Goal, Status } from './entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalAdapter } from './goal.adapter';
import { GoalModel } from './models/goal.model';
import { CreateGoalInput } from './inputs/create-goal.input';
import { UpdateGoalInput } from './inputs/update-goal.input';
import { GQLUserId } from 'src/auth/decorators/user-id-ql.decorator';

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
    @GQLUserId() userId: number
  ): Promise<GoalModel> {
    const goal = await this.goalService.create(this.goalAdapter.toCreateDto(createGoalInput), userId);
    return this.goalAdapter.toModel(goal);
  }

  @Query(() => [GoalModel], { 
    name: "goals", 
    description: 'Retrieve all goals',
  })
  async findAll(
    @GQLUserId() userId: number
  ): Promise<GoalModel[]> {
    const goals = await this.goalService.findAll(userId);
    const goalsModel: GoalModel[] = goals.map((goal) => {
      return this.goalAdapter.toModel(goal);
    });
    return goalsModel;
  }

  @Query(() => GoalModel, { 
    name: "goal", 
    description: 'Retrieve goal wth specified id',
  })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ): Promise<GoalModel> {
    const goal = await this.goalService.findOne(id, userId);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel, { 
    name: "updateGoal", 
    description: 'Update goal wth specified id',
  })
  async updateGoal(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateGoalInput') updateGoalInput: UpdateGoalInput,
    @GQLUserId() userId: number
  ) {
    const goal = await this.goalService.update(id, this.goalAdapter.toUpdateDto(updateGoalInput), userId);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel, { 
    name: "removeGoal", 
    description: 'Remove goal wth specified id',
  })
  async removeGoal(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ) {
    const goal = await this.goalService.remove(id, userId);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel, { 
    name: "completeGoal", 
    description: 'Marked as complete goal wth specified id',
  })
  async completeGoal(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ): Promise<GoalModel> {
    const goal = await this.goalService.completeGoal(id, userId);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  @Mutation(() => GoalModel, { 
    name: "uncompleteGoal", 
    description: 'Marked as uncomplete goal wth specified id',
  })
  async uncompleteGoal(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ): Promise<GoalModel> {
    const goal = await this.goalService.uncompleteGoal(id, userId);
    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }
}
