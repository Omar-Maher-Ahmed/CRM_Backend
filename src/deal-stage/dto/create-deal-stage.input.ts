import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType() 
export class CreateDealStageInput { 
  @Field() 
  @IsString()
  @IsNotEmpty()
  name: string; 
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  position?: number; 
}