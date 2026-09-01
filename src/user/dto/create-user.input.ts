import { Field, Float, Int, ID, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

@InputType()
export class CreateUserInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;
     
  @Field()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => Float)
  @IsNumber()
  salary: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  managerId?: number;
}