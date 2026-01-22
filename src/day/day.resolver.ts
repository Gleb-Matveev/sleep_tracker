import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DayModel } from './models/day.model';
import { DayService } from './day.service';
import { DayAdapter } from './day.adapter';
import { CreateDayInput } from './inputs/create-day.input';
import { UpdateDayInput } from './inputs/update-day.input';

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
  ): Promise<DayModel> {
    const day = await this.dayService.create(
      this.dayAdapter.toCreateDto(createDayInput),
    );
    return this.dayAdapter.toModel(day);
  }

  @Query(() => [DayModel], {
    name: "days",
    description: 'Retrieve all days',
  })
  async findAll(): Promise<DayModel[]> {
    const days = await this.dayService.findAll();
    const daysModel: DayModel[] = days.map((day) =>
      this.dayAdapter.toModel(day),
    );
    return daysModel;
  }

  @Query(() => DayModel, { 
    name: "day", 
    description: 'Retrieve day with specified id',
  })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<DayModel> {
    const day = await this.dayService.findOne(id);
    const dayModel = this.dayAdapter.toModel(day);
    return dayModel;
  }

  @Mutation(() => DayModel)
  async updateDay(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateDayInput') updateDayInput: UpdateDayInput,
  ): Promise<DayModel> {
    const day = await this.dayService.update(
      id,
      this.dayAdapter.toUpdateDto(updateDayInput),
    );
    const dayModel = this.dayAdapter.toModel(day);
    return dayModel;
  }

  @Mutation(() => DayModel)
  async removeDay(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<DayModel> {
    const day = await this.dayService.remove(id);
    const dayModel = this.dayAdapter.toModel(day);
    return dayModel;
  }
}
