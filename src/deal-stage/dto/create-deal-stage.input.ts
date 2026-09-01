import { InputType, Field, Int } from '@nestjs/graphql';
@InputType() export class CreateDealStageInput { @Field() name: string; @Field(() => Int, { nullable: true }) position?: number; }