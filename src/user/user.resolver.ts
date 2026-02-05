import { Args, Mutation, Resolver, Query, Int } from '@nestjs/graphql';
import { GQLUserId } from 'src/auth/decorators/user-id-ql.decorator';
import { UserAdapter } from './user.adapter';
import { UserService } from './user.service';
import { UserModel } from './models/user.model';

@Resolver(() => UserModel)
export class UserResolver {
  constructor(
    private readonly userAdapter: UserAdapter,
    private readonly userService: UserService,
  ) {}

  @Query(() => [UserModel], {
    name: 'users',
    description: 'Retrieve all rules',
  })
  async findAll(
  ): Promise<UserModel[]> {
    const users = await this.userService.findAll();
    const usersModel: UserModel[] = users.map((user) => {
      return this.userAdapter.toModel(user);
    });
    return usersModel;
  }

  @Query(() => UserModel, {
    name: 'user',
    description: 'Retrieve user with specified id',
  })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<UserModel> {
    const rule = await this.userService.findOne(id);
    const ruleModel = this.userAdapter.toModel(rule);
    return ruleModel;
  }
}
