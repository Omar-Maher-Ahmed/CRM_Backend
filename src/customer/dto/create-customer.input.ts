import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateCustomerInput {
  @Field() 
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  companyName?: string;
  
  @Field({ nullable: true }) 
  @IsOptional()
  @IsEmail()
  email?: string;
  
  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  phone?: string;
  
  @Field({ nullable: true }) 
  @IsOptional()
  @IsString()
  status?: string;
  
  @Field(() => Int, { nullable: true }) 
  @IsOptional()
  @IsNumber()
  managerId?: number;
}