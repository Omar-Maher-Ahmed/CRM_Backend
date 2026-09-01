import { CreateCustomerInput } from './create-customer.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => ID) id: number;
}