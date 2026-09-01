import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Deal } from '../../deal/entities/deal.entity';
import { User } from '../../user/entity/user.entity';
import { Product } from '../../product/entities/product.entity';

@ObjectType()
@Entity('activities')
export class Activity {
  @Field(() => ID) @PrimaryGeneratedColumn() id: number;
  @Field(() => Deal, { nullable: true }) @ManyToOne(() => Deal, { nullable: true, eager: true, onDelete: 'CASCADE' }) deal: Deal;
  @Field(() => User, { nullable: true }) @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'CASCADE' }) user: User;
  @Field(() => Product, { nullable: true }) @ManyToOne(() => Product, { nullable: true, eager: true, onDelete: 'CASCADE' }) product: Product;
  @Field({ nullable: true }) @Column({ type: 'text', nullable: true }) description: string;
  @Field() @CreateDateColumn() createdAt: Date;
}