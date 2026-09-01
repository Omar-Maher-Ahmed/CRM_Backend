import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@ObjectType()
@Entity('products')
export class Product {
  @Field(() => ID) @PrimaryGeneratedColumn() id: number;
  @Field() @Column() name: string;
  @Field({ nullable: true }) @Column({ type: 'text', nullable: true }) description: string;
  @Field(() => Float, { nullable: true }) @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) price: number;
  @Field({ nullable: true }) @Column({ nullable: true }) imageUrl: string;
  @Field() @CreateDateColumn() createdAt: Date;
}