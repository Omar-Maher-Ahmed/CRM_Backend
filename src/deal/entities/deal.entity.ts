import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Customer } from '../../customer/entities/customer.entity';
import { User } from '../../user/entity/user.entity';
import { DealStage } from '../../deal-stage/entities/deal-stage.entity';
import { DealProduct } from './deal-product.entity';

@ObjectType()
@Entity('deals')
export class Deal {
  @Field(() => ID) @PrimaryGeneratedColumn() id: number;
  @Field(() => Customer, { nullable: true }) @ManyToOne(() => Customer, { eager: true, nullable: true }) customer: Customer;
  @Field(() => User, { nullable: true }) @ManyToOne(() => User, { eager: true, nullable: true }) owner: User;
  @Field(() => DealStage, { nullable: true }) @ManyToOne(() => DealStage, { eager: true, nullable: true }) stage: DealStage;
  @Field() @Column() title: string;
  @Field(() => Float, { nullable: true }) @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) value: number;
  @Field(() => [DealProduct], { nullable: true }) @OneToMany(() => DealProduct, (dealProduct) => dealProduct.deal, { cascade: true, eager: true }) dealProducts: DealProduct[];
  @Field() @CreateDateColumn() createdAt: Date;
  @Field() @UpdateDateColumn() updatedAt: Date;
}