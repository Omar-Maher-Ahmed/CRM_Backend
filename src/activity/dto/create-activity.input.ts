import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateActivityInput {
  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  description?: string;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  dealId?: number;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  userId?: number;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  productId?: number;
}