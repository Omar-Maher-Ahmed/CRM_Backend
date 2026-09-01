import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DealService } from './deal.service';
import { Deal } from './entities/deal.entity';
import { CreateDealInput } from './dto/create-deal.input';
import { UpdateDealInput } from './dto/update-deal.input';

@Resolver(() => Deal)
export class DealResolver {
  constructor(private readonly service: DealService) {}
  @Mutation(() => Deal) createDeal(@Args('input') input: CreateDealInput) { return this.service.create(input); }
  @Query(() => [Deal]) deals() { return this.service.findAll(); }
  @Query(() => Deal) deal(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Deal) updateDeal(@Args('input') input: UpdateDealInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeDeal(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}