import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DealStageService } from './deal-stage.service';
import { DealStage } from './entities/deal-stage.entity';
import { CreateDealStageInput } from './dto/create-deal-stage.input';
import { UpdateDealStageInput } from './dto/update-deal-stage.input';

@Resolver(() => DealStage)
export class DealStageResolver {
  constructor(private readonly service: DealStageService) {}
  @Mutation(() => DealStage) createDealStage(@Args('input') input: CreateDealStageInput) { return this.service.create(input); }
  @Query(() => [DealStage]) dealStages() { return this.service.findAll(); }
  @Query(() => DealStage) dealStage(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => DealStage) updateDealStage(@Args('input') input: UpdateDealStageInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeDealStage(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}