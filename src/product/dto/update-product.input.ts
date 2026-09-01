import { CreateProductInput } from './create-product.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) { @Field(() => ID) id: number; }