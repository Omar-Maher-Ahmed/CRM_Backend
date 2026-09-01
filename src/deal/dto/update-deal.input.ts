import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateDealInput } from './create-deal.input';
import {  InputType, PartialType, Field, ID , Int } from '@nestjs/graphql';
@InputType()
export class UpdateDealInput extends PartialType(CreateDealInput) { @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number; }