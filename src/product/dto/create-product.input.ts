import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field() 
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  description?: string;
  
  @Field(() => Float, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  price?: number;
  
  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  imageUrl?: string;
}