import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly service: ProductService) {}
  @Mutation(() => Product) createProduct(@Args('input') input: CreateProductInput) { return this.service.create(input); }
  @Query(() => [Product]) products() { return this.service.findAll(); }
  @Query(() => Product) product(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Product) updateProduct(@Args('input') input: UpdateProductInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeProduct(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}