import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateDealProductInput {
  @Field(() => Int) 
  @IsNumber()
  productId: number;
  
  @Field(() => Int) 
  @IsNumber()
  quantity: number;
  
  @Field(() => Float) 
  @IsNumber()
  unitPrice: number;
  
  @Field(() => Float) 
  @IsNumber()
  totalPrice: number;
}

@InputType()
export class CreateDealInput {
  @Field() 
  @IsString()
  @IsNotEmpty()
  title: string;
  
  @Field(() => Float, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  value?: number;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  customerId?: number;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  ownerId?: number;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  stageId?: number;
  
  @Field(() => [CreateDealProductInput], { nullable: true }) 
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDealProductInput)
  products?: CreateDealProductInput[];
}