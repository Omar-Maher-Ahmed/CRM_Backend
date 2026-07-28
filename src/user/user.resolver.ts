import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entity/user.entity';
import { UsersService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver  {
  constructor(
    private readonly usersService: UsersService,
  ) {}


  @Mutation(() => User)
  createUser(
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
      return this.usersService.create(input);
  }

  @Query(() => [User])
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Query(() => User)
  getUser(
    @Args('id', { type: () => ID }) id: number,
  ): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => String)
  updateUser(
    @Args('id', { type: () => ID })
    id: string,
  ) {}

  @Mutation(() => String)
  removeUser(
    @Args('id', { type: () => ID })
    id: string,
  ) {}

}