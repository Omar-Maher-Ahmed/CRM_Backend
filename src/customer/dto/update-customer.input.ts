import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateCustomerInput } from './create-customer.input';
import {  InputType, PartialType, Field, ID , Int } from '@nestjs/graphql';
@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;
}