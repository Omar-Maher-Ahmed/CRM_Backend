import { IsNumber, IsNotEmpty } from 'class-validator';
import { CreateRoleInput } from './create-role.input';
import {  InputType, Field, PartialType, ID , Int } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends PartialType(CreateRoleInput) {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
