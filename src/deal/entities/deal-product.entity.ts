import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { Deal } from './deal.entity';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
@Entity('deal_products')
export class DealProduct {
  @PrimaryColumn() dealId: number;
  @PrimaryColumn() productId: number;
  @ManyToOne(() => Deal, (deal) => deal.dealProducts, { onDelete: 'CASCADE' }) deal: Deal;
  @Field(() => Product) @ManyToOne(() => Product, { eager: true }) product: Product;
  @Field(() => Int) @Column({ default: 1 }) quantity: number;
  @Field(() => Float) @Column({ type: 'decimal', precision: 12, scale: 2 }) unitPrice: number;
  @Field(() => Float) @Column({ type: 'decimal', precision: 12, scale: 2 }) totalPrice: number;
}