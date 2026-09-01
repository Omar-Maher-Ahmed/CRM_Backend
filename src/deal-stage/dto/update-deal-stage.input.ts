import { CreateDealStageInput } from './create-deal-stage.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType() export class UpdateDealStageInput extends PartialType(CreateDealStageInput) { @Field(() => ID) id: number; }