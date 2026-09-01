import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity('deal_stages')
export class DealStage {
  @Field(() => ID) @PrimaryGeneratedColumn() id: number;
  @Field() @Column({ unique: true }) name: string;
  @Field(() => Int, { nullable: true }) @Column({ nullable: true }) position: number;
}