import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entity/user.entity';
import { UsersService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';

@Resolver(() => User)
export class UsersResolver  {
  constructor(
    private readonly usersService: UsersService,
  ) {}


  @Mutation(() => String)
  createUser(
    @Args('input') input: CreateUserInput,
  ) {
      return this.usersService.create(input);
  }

  @Query(() => String)
  users() {
    return this.usersService.findAll();
  }

  @Query(() => String)
  getUser
   (@Args('id', { type: () => ID })
    id: number
  ){}

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