import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly service: CustomerService) {}
  @Mutation(() => Customer) createCustomer(@Args('input') input: CreateCustomerInput) { return this.service.create(input); }
  @Query(() => [Customer]) customers() { return this.service.findAll(); }
  @Query(() => Customer) customer(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Customer) updateCustomer(@Args('input') input: UpdateCustomerInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeCustomer(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}