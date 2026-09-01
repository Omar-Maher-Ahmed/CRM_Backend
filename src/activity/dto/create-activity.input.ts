import { InputType, Field, ID } from '@nestjs/graphql';
@InputType()
export class CreateActivityInput {
  @Field({ nullable: true }) description?: string;
  @Field(() => ID, { nullable: true }) dealId?: number;
  @Field(() => ID, { nullable: true }) userId?: number;
  @Field(() => ID, { nullable: true }) productId?: number;
}