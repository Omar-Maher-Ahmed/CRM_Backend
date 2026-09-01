import { InputType, Field, Float } from '@nestjs/graphql';
@InputType()
export class CreateProductInput {
  @Field() name: string;
  @Field({ nullable: true }) description?: string;
  @Field(() => Float, { nullable: true }) price?: number;
  @Field({ nullable: true }) imageUrl?: string;
}