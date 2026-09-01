import { InputType, Field, ID } from '@nestjs/graphql';
@InputType()
export class CreateCustomerInput {
  @Field() name: string;
  @Field({ nullable: true }) companyName?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) status?: string;
  @Field(() => ID, { nullable: true }) managerId?: number;
}