import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private readonly service: ActivityService) {}
  @Mutation(() => Activity) createActivity(@Args('input') input: CreateActivityInput) { return this.service.create(input); }
  @Query(() => [Activity]) activities() { return this.service.findAll(); }
  @Query(() => Activity) activity(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Activity) updateActivity(@Args('input') input: UpdateActivityInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeActivity(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}