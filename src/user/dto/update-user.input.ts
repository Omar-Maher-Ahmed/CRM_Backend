import { IsNumber, IsNotEmpty } from 'class-validator';
import {  InputType, PartialType , Int } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {}