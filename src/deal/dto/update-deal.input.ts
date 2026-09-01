import { CreateDealInput } from './create-deal.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateDealInput extends PartialType(CreateDealInput) { @Field(() => ID) id: number; }