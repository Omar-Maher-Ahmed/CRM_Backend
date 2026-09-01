import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateActivityInput } from './create-activity.input';
import {  InputType, PartialType, Field, ID , Int } from '@nestjs/graphql';
@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) { @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number; }