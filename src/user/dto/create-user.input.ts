import { Field, Float, ID, InputType } from "@nestjs/graphql";

@InputType()
export class CreateUserInput {
  @Field()
  fullName: string;

  @Field()
  email: string;
     
  @Field()
  phone: string;

  @Field()
  password: string;

  @Field(() => Float)
  salary: number;

//   @Field(() => ID)
//   roleId: number;

  @Field(() => ID, { nullable: true })
  managerId?: number;
}