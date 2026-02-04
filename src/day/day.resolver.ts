import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { DayModel } from './models/day.model';
import { DayService } from './day.service';
import { DayAdapter } from './day.adapter';
import { CreateDayInput } from './inputs/create-day.input';
import { UpdateDayInput } from './inputs/update-day.input';
import { RoutineModel } from 'src/routine/models/routine.model';
import { DaysPaginationModel } from './models/day-pagination.model';
import { GQLUserId } from 'src/auth/decorators/user-id-ql.decorator';

@Resolver(() => DayModel)
export class DayResolver {
  constructor(
    private readonly dayService: DayService,
    private readonly dayAdapter: DayAdapter,
  ) {}

  @Mutation(() => DayModel, {
    name: 'createDay',
    description: 'Create a new day',
  })
  async create(
    @Args('createDayInput') createDayInput: CreateDayInput,
    @GQLUserId() userId: number
  ): Promise<DayModel> {
    const day = await this.dayService.create(
      this.dayAdapter.toCreateDto(createDayInput),
      userId
    );
    return this.dayAdapter.toModel(day);
  }

  @Query(() => [DayModel], {
    name: "days",
    description: 'Retrieve all days',
  })
  async findAll(
    @GQLUserId() userId: number
  ): Promise<DayModel[]> {
    const days = await this.dayService.findAll(userId);
    const daysModel: DayModel[] = days.map((day) =>
      this.dayAdapter.toModel(day),
    );
    return daysModel;
  }

  @Query(() => DaysPaginationModel, {
    name: "daysPaginated",
    description: 'Retrieve all days with pagination',
  })
  async findAllPaginated(
    @Args('page', {type: () => Int}) page: number,
    @Args('limit', {type: () => Int}) limit: number,
    @GQLUserId() userId: number
  ): Promise<DaysPaginationModel> {
    const { data, total } = await this.dayService.findAllPaginated(page, limit, userId);
    console.log("Data:", data);
    console.log("Total:", total);
    const daysModel: DayModel[] = data.map((day) =>
      this.dayAdapter.toModel(day),
    );
    const daysPaginated = new DaysPaginationModel();
    daysPaginated.days = daysModel;
    daysPaginated.total = total;

    console.log("Result:", daysPaginated);
    return daysPaginated;
  }

  @Query(() => DayModel, { 
    name: "day", 
    description: 'Retrieve day with specified id',
  })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ): Promise<DayModel> {
    const day = await this.dayService.findOne(id, userId);
    const dayModel = this.dayAdapter.toModel(day);
    return dayModel;
  }

  @Mutation(() => DayModel, { 
    name: "updateDay", 
    description: 'Update day with specified id',
  })
  async updateDay(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDayInput') updateDayInput: UpdateDayInput,
    @GQLUserId() userId: number,
  ): Promise<DayModel> {
    const day = await this.dayService.update(
      id,
      this.dayAdapter.toUpdateDto(updateDayInput),
      userId
    );
    const dayModel = this.dayAdapter.toModel(day);
    return dayModel;
  }

  @Mutation(() => DayModel, { 
    name: "removeDay", 
    description: 'Remove day with specified id',
  })
  async removeDay(
    @Args('id', { type: () => Int }) id: number,
    @GQLUserId() userId: number
  ): Promise<DayModel> {
    const day = await this.dayService.remove(id, userId);
    const dayModel = this.dayAdapter.toModel(day);
    return dayModel;
  }

  @ResolveField(() => [RoutineModel], {
    name: "toRoutine",
    description: "Routines related to the day"
  })
  async getRoutine(
    @Parent() day: DayModel,
    @GQLUserId() userId: number
  ): Promise<RoutineModel[]> {
    if (!day.routines) {
        const day_with_routines = await this.dayService.findOne(day.id, userId);
        if (!day_with_routines.routines) {
            return [];
        } else {
            return day_with_routines.routines.map((routine) => this.dayAdapter.toRoutineModel(routine.routine));
        }
    }
    return day.routines;
  }
}
