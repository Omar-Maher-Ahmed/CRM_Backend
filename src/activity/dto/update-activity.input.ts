import { CreateActivityInput } from './create-activity.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) { @Field(() => ID) id: number; }