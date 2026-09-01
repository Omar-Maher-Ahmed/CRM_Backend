import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
@InputType()
export class CreateDealProductInput {
  @Field(() => ID) productId: number;
  @Field(() => Int) quantity: number;
  @Field(() => Float) unitPrice: number;
  @Field(() => Float) totalPrice: number;
}
@InputType()
export class CreateDealInput {
  @Field() title: string;
  @Field(() => Float, { nullable: true }) value?: number;
  @Field(() => ID, { nullable: true }) customerId?: number;
  @Field(() => ID, { nullable: true }) ownerId?: number;
  @Field(() => ID, { nullable: true }) stageId?: number;
  @Field(() => [CreateDealProductInput], { nullable: true }) products?: CreateDealProductInput[];
}