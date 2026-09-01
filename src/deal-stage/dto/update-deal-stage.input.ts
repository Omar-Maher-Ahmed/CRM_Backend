import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateDealStageInput } from './create-deal-stage.input';
import {  InputType, PartialType, Field, ID , Int } from '@nestjs/graphql';
@InputType() export class UpdateDealStageInput extends PartialType(CreateDealStageInput) { @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number; }