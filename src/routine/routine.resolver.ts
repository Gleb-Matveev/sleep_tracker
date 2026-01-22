import { Args, Int, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RoutineService } from './routine.service';
import { RoutineAdapter } from './routine.adapter';
import { RoutineModel } from './models/routine.model';
import { CreateRoutineInput } from './inputs/routine-create.input';
import { UpdateRoutineInput } from './inputs/routine-update.input';
import { UpdateRoutineDto } from './dto/update-routine.dto';

@Resolver(() => RoutineModel)
export class RoutineResolver {
  constructor(
    private readonly routineService: RoutineService,
    private readonly routineAdapter: RoutineAdapter,
  ) {}

  @Mutation(() => RoutineModel, {
    name: 'createRoutine',
    description: 'Create new routine',
  })
  async create(
    @Args('createRoutineInput') createRoutineInput: CreateRoutineInput,
  ): Promise<RoutineModel> {
    const routine = await this.routineService.create(
      this.routineAdapter.toCreateDto(createRoutineInput),
    );
    return this.routineAdapter.toModel(routine);
  }

  @Query(() => [RoutineModel], { name: 'routines' })
  async findAll(): Promise<RoutineModel[]> {
    const routines = await this.routineService.findAll();
    const routineModels: RoutineModel[] = routines.map((routine) =>
      this.routineAdapter.toModel(routine),
    );
    return routineModels;
  }

  @Query(() => RoutineModel, { name: 'routine' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RoutineModel> {
    const routine = await this.routineService.findOne(id);

    if (!routine) {
      throw new Error(`Routine with id ${id} not found`);
    }

    const routineModel = this.routineAdapter.toModel(routine);
    return routineModel;
  }

  @Mutation(() => RoutineModel)
  async updateRoutine(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRoutineInput') updateRoutineInput: UpdateRoutineInput,
  ): Promise<RoutineModel> {
    const routine = await this.routineService.update(
      id,
      this.routineAdapter.toUpdateDto(updateRoutineInput),
    );
    const routineModel = this.routineAdapter.toModel(routine);
    return routineModel;
  }

  @Mutation(() => RoutineModel)
  async removeRoutine(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RoutineModel> {
    const routine = await this.routineService.remove(id);
    const routineModel = this.routineAdapter.toModel(routine);
    return routineModel;
  }

  @Mutation(() => RoutineModel, {description: "Adds steps to the specified routine"})
  async addSteps(
    @Args('id', { type: () => Int }) id: number,
    @Args('steps', { type: () => [String]}) steps: string[]
  ): Promise<RoutineModel> {
    const routine = await this.routineService.addSteps(
      id,
      steps
    );
    const routineModel = this.routineAdapter.toModel(routine);
    return routineModel;
  }

  @Mutation(() => RoutineModel, {description: "Change period day/night"})
  async changePeriod(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<RoutineModel> {
    const routine = await this.routineService.changePeriod(id);
    const routineModel = this.routineAdapter.toModel(routine);
    return routineModel;
  }
}
