import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateProductInput } from './create-product.input';
import {  InputType, PartialType, Field, ID , Int } from '@nestjs/graphql';
@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) { @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number; }