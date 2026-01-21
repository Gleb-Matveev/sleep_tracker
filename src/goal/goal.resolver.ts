import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Goal } from './entities/goal.entity';
import { GoalService } from './goal.service';
import { GoalAdapter } from './goal.adapter';
import { GoalModel } from './models/goal.model';
import { CreateGoalInput } from './inputs/create-goal.input';

@Resolver(() => GoalModel)
export class GoalResolver {
  constructor(
    private readonly goalAdapter: GoalAdapter,
    private readonly goalService: GoalService,
  ) {}

  @Mutation(() => Int)
  async createGoal(
    @Args('createGoalInput') createGoalInput: CreateGoalInput,
  ) {
    console.log("aDASD/F.,JA;SLDKFJA;LSKDFJA;LDdfasdf");
    //console.log('Received createGoalInput:', createGoalInput);
    //const goal = await this.goalService.create(this.goalAdapter.toDto(createGoalInput));
    //return this.goalAdapter.toModel(goal);
    return 5;
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

    if (!goal) {
      throw new Error(`Goal with id ${id} not found`);
    }

    const goalModel = this.goalAdapter.toModel(goal);
    return goalModel;
  }

  /*@Mutation(() => GqTest)
  updateGoal(
    @Args('updateGqTestInput') updateGqTestInput: UpdateGqTestInput,
  ) {
    return this.gqTestService.update(updateGqTestInput.id, updateGqTestInput);
  }

  @Mutation(() => GqTest)
  removeGoal(@Args('id', { type: () => Int }) id: number) {
    return this.gqTestService.remove(id);
  }*/
}
