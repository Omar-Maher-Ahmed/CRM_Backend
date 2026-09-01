const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'src');

const files = {
  // Customer
  'customer/entities/customer.entity.ts': `import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entity/user.entity';

@ObjectType()
@Entity('customers')
export class Customer {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  companyName: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  status: string;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, { nullable: true, eager: true })
  manager: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}`,
  'customer/dto/create-customer.input.ts': `import { InputType, Field, ID } from '@nestjs/graphql';
@InputType()
export class CreateCustomerInput {
  @Field() name: string;
  @Field({ nullable: true }) companyName?: string;
  @Field({ nullable: true }) email?: string;
  @Field({ nullable: true }) phone?: string;
  @Field({ nullable: true }) status?: string;
  @Field(() => ID, { nullable: true }) managerId?: number;
}`,
  'customer/dto/update-customer.input.ts': `import { CreateCustomerInput } from './create-customer.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateCustomerInput extends PartialType(CreateCustomerInput) {
  @Field(() => ID) id: number;
}`,
  'customer/customer.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Injectable()
export class CustomerService {
  constructor(@InjectRepository(Customer) private repo: Repository<Customer>) {}
  create(input: CreateCustomerInput) {
    const customer = this.repo.create({ ...input, manager: input.managerId ? { id: input.managerId } as any : null });
    return this.repo.save(customer);
  }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  async update(id: number, input: UpdateCustomerInput) {
    const customer = await this.findOne(id);
    if (!customer) throw new NotFoundException('Customer not found');
    Object.assign(customer, input);
    if (input.managerId !== undefined) {
      customer.manager = input.managerId ? { id: input.managerId } as any : null;
    }
    return this.repo.save(customer);
  }
  async remove(id: number) {
    await this.repo.delete(id);
    return true;
  }
}`,
  'customer/customer.resolver.ts': `import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly service: CustomerService) {}
  @Mutation(() => Customer) createCustomer(@Args('input') input: CreateCustomerInput) { return this.service.create(input); }
  @Query(() => [Customer]) customers() { return this.service.findAll(); }
  @Query(() => Customer) customer(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Customer) updateCustomer(@Args('input') input: UpdateCustomerInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeCustomer(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}`,
  'customer/customer.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { Customer } from './entities/customer.entity';
@Module({ imports: [TypeOrmModule.forFeature([Customer])], providers: [CustomerResolver, CustomerService], exports: [CustomerService] })
export class CustomerModule {}`,

  // Product
  'product/entities/product.entity.ts': `import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
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
}`,
  'product/dto/create-product.input.ts': `import { InputType, Field, Float } from '@nestjs/graphql';
@InputType()
export class CreateProductInput {
  @Field() name: string;
  @Field({ nullable: true }) description?: string;
  @Field(() => Float, { nullable: true }) price?: number;
  @Field({ nullable: true }) imageUrl?: string;
}`,
  'product/dto/update-product.input.ts': `import { CreateProductInput } from './create-product.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) { @Field(() => ID) id: number; }`,
  'product/product.service.ts': `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}
  create(input: CreateProductInput) { return this.repo.save(this.repo.create(input)); }
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  async update(id: number, input: UpdateProductInput) {
    const product = await this.findOne(id);
    Object.assign(product, input);
    return this.repo.save(product);
  }
  async remove(id: number) { await this.repo.delete(id); return true; }
}`,
  'product/product.resolver.ts': `import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly service: ProductService) {}
  @Mutation(() => Product) createProduct(@Args('input') input: CreateProductInput) { return this.service.create(input); }
  @Query(() => [Product]) products() { return this.service.findAll(); }
  @Query(() => Product) product(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Product) updateProduct(@Args('input') input: UpdateProductInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeProduct(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}`,
  'product/product.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { Product } from './entities/product.entity';
@Module({ imports: [TypeOrmModule.forFeature([Product])], providers: [ProductResolver, ProductService], exports: [ProductService] })
export class ProductModule {}`,

  // Deal Stage
  'deal-stage/entities/deal-stage.entity.ts': `import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@ObjectType()
@Entity('deal_stages')
export class DealStage {
  @Field(() => ID) @PrimaryGeneratedColumn() id: number;
  @Field() @Column({ unique: true }) name: string;
  @Field(() => Int, { nullable: true }) @Column({ nullable: true }) position: number;
}`,
  'deal-stage/dto/create-deal-stage.input.ts': `import { InputType, Field, Int } from '@nestjs/graphql';
@InputType() export class CreateDealStageInput { @Field() name: string; @Field(() => Int, { nullable: true }) position?: number; }`,
  'deal-stage/dto/update-deal-stage.input.ts': `import { CreateDealStageInput } from './create-deal-stage.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType() export class UpdateDealStageInput extends PartialType(CreateDealStageInput) { @Field(() => ID) id: number; }`,
  'deal-stage/deal-stage.service.ts': `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DealStage } from './entities/deal-stage.entity';
import { CreateDealStageInput } from './dto/create-deal-stage.input';
import { UpdateDealStageInput } from './dto/update-deal-stage.input';

@Injectable()
export class DealStageService {
  constructor(@InjectRepository(DealStage) private repo: Repository<DealStage>) {}
  create(input: CreateDealStageInput) { return this.repo.save(this.repo.create(input)); }
  findAll() { return this.repo.find({ order: { position: 'ASC' } }); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  async update(id: number, input: UpdateDealStageInput) {
    const item = await this.findOne(id);
    Object.assign(item, input);
    return this.repo.save(item);
  }
  async remove(id: number) { await this.repo.delete(id); return true; }
}`,
  'deal-stage/deal-stage.resolver.ts': `import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DealStageService } from './deal-stage.service';
import { DealStage } from './entities/deal-stage.entity';
import { CreateDealStageInput } from './dto/create-deal-stage.input';
import { UpdateDealStageInput } from './dto/update-deal-stage.input';

@Resolver(() => DealStage)
export class DealStageResolver {
  constructor(private readonly service: DealStageService) {}
  @Mutation(() => DealStage) createDealStage(@Args('input') input: CreateDealStageInput) { return this.service.create(input); }
  @Query(() => [DealStage]) dealStages() { return this.service.findAll(); }
  @Query(() => DealStage) dealStage(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => DealStage) updateDealStage(@Args('input') input: UpdateDealStageInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeDealStage(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}`,
  'deal-stage/deal-stage.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealStageService } from './deal-stage.service';
import { DealStageResolver } from './deal-stage.resolver';
import { DealStage } from './entities/deal-stage.entity';
@Module({ imports: [TypeOrmModule.forFeature([DealStage])], providers: [DealStageResolver, DealStageService], exports: [DealStageService] })
export class DealStageModule {}`,

  // Deal (including deal_products)
  'deal/entities/deal.entity.ts': `import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
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
}`,
  'deal/entities/deal-product.entity.ts': `import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
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
}`,
  'deal/dto/create-deal.input.ts': `import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
@InputType()
export class CreateDealProductInput {
  @Field(() => ID) productId: number;
  @Field(() => Int) quantity: number;
  @Field(() => Float) unitPrice: number;
  @Field(() => Float) totalPrice: number;
}
@InputType()
export class CreateDealInput {
  @Field() title: string;
  @Field(() => Float, { nullable: true }) value?: number;
  @Field(() => ID, { nullable: true }) customerId?: number;
  @Field(() => ID, { nullable: true }) ownerId?: number;
  @Field(() => ID, { nullable: true }) stageId?: number;
  @Field(() => [CreateDealProductInput], { nullable: true }) products?: CreateDealProductInput[];
}`,
  'deal/dto/update-deal.input.ts': `import { CreateDealInput } from './create-deal.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateDealInput extends PartialType(CreateDealInput) { @Field(() => ID) id: number; }`,
  'deal/deal.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { DealProduct } from './entities/deal-product.entity';
import { CreateDealInput } from './dto/create-deal.input';
import { UpdateDealInput } from './dto/update-deal.input';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal) private repo: Repository<Deal>,
    @InjectRepository(DealProduct) private dpRepo: Repository<DealProduct>
  ) {}
  
  async create(input: CreateDealInput) {
    const deal = this.repo.create({
      title: input.title,
      value: input.value,
      customer: input.customerId ? { id: input.customerId } as any : null,
      owner: input.ownerId ? { id: input.ownerId } as any : null,
      stage: input.stageId ? { id: input.stageId } as any : null,
    });
    const savedDeal = await this.repo.save(deal);
    
    if (input.products && input.products.length > 0) {
      const dealProducts = input.products.map(p => this.dpRepo.create({
        dealId: savedDeal.id,
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalPrice: p.totalPrice,
      }));
      await this.dpRepo.save(dealProducts);
    }
    return this.findOne(savedDeal.id);
  }
  
  findAll() { return this.repo.find(); }
  
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  
  async update(id: number, input: UpdateDealInput) {
    const deal = await this.repo.findOne({ where: { id } });
    if (!deal) throw new NotFoundException('Deal not found');
    
    if (input.title !== undefined) deal.title = input.title;
    if (input.value !== undefined) deal.value = input.value;
    if (input.customerId !== undefined) deal.customer = input.customerId ? { id: input.customerId } as any : null;
    if (input.ownerId !== undefined) deal.owner = input.ownerId ? { id: input.ownerId } as any : null;
    if (input.stageId !== undefined) deal.stage = input.stageId ? { id: input.stageId } as any : null;
    
    await this.repo.save(deal);
    
    if (input.products) {
      await this.dpRepo.delete({ dealId: id });
      const dealProducts = input.products.map(p => this.dpRepo.create({
        dealId: id,
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.unitPrice,
        totalPrice: p.totalPrice,
      }));
      await this.dpRepo.save(dealProducts);
    }
    return this.findOne(id);
  }
  
  async remove(id: number) { await this.repo.delete(id); return true; }
}`,
  'deal/deal.resolver.ts': `import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { DealService } from './deal.service';
import { Deal } from './entities/deal.entity';
import { CreateDealInput } from './dto/create-deal.input';
import { UpdateDealInput } from './dto/update-deal.input';

@Resolver(() => Deal)
export class DealResolver {
  constructor(private readonly service: DealService) {}
  @Mutation(() => Deal) createDeal(@Args('input') input: CreateDealInput) { return this.service.create(input); }
  @Query(() => [Deal]) deals() { return this.service.findAll(); }
  @Query(() => Deal) deal(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Deal) updateDeal(@Args('input') input: UpdateDealInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeDeal(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}`,
  'deal/deal.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealService } from './deal.service';
import { DealResolver } from './deal.resolver';
import { Deal } from './entities/deal.entity';
import { DealProduct } from './entities/deal-product.entity';
@Module({ imports: [TypeOrmModule.forFeature([Deal, DealProduct])], providers: [DealResolver, DealService], exports: [DealService] })
export class DealModule {}`,

  // Activity
  'activity/entities/activity.entity.ts': `import { ObjectType, Field, ID } from '@nestjs/graphql';
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
}`,
  'activity/dto/create-activity.input.ts': `import { InputType, Field, ID } from '@nestjs/graphql';
@InputType()
export class CreateActivityInput {
  @Field({ nullable: true }) description?: string;
  @Field(() => ID, { nullable: true }) dealId?: number;
  @Field(() => ID, { nullable: true }) userId?: number;
  @Field(() => ID, { nullable: true }) productId?: number;
}`,
  'activity/dto/update-activity.input.ts': `import { CreateActivityInput } from './create-activity.input';
import { InputType, PartialType, Field, ID } from '@nestjs/graphql';
@InputType()
export class UpdateActivityInput extends PartialType(CreateActivityInput) { @Field(() => ID) id: number; }`,
  'activity/activity.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';

@Injectable()
export class ActivityService {
  constructor(@InjectRepository(Activity) private repo: Repository<Activity>) {}
  
  create(input: CreateActivityInput) {
    const activity = this.repo.create({
      description: input.description,
      deal: input.dealId ? { id: input.dealId } as any : null,
      user: input.userId ? { id: input.userId } as any : null,
      product: input.productId ? { id: input.productId } as any : null,
    });
    return this.repo.save(activity);
  }
  
  findAll() { return this.repo.find(); }
  findOne(id: number) { return this.repo.findOne({ where: { id } }); }
  
  async update(id: number, input: UpdateActivityInput) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Activity not found');
    
    if (input.description !== undefined) item.description = input.description;
    if (input.dealId !== undefined) item.deal = input.dealId ? { id: input.dealId } as any : null;
    if (input.userId !== undefined) item.user = input.userId ? { id: input.userId } as any : null;
    if (input.productId !== undefined) item.product = input.productId ? { id: input.productId } as any : null;
    
    return this.repo.save(item);
  }
  async remove(id: number) { await this.repo.delete(id); return true; }
}`,
  'activity/activity.resolver.ts': `import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(private readonly service: ActivityService) {}
  @Mutation(() => Activity) createActivity(@Args('input') input: CreateActivityInput) { return this.service.create(input); }
  @Query(() => [Activity]) activities() { return this.service.findAll(); }
  @Query(() => Activity) activity(@Args('id', { type: () => ID }) id: number) { return this.service.findOne(id); }
  @Mutation(() => Activity) updateActivity(@Args('input') input: UpdateActivityInput) { return this.service.update(input.id, input); }
  @Mutation(() => Boolean) removeActivity(@Args('id', { type: () => ID }) id: number) { return this.service.remove(id); }
}`,
  'activity/activity.module.ts': `import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { ActivityResolver } from './activity.resolver';
import { Activity } from './entities/activity.entity';
@Module({ imports: [TypeOrmModule.forFeature([Activity])], providers: [ActivityResolver, ActivityService], exports: [ActivityService] })
export class ActivityModule {}`,
};

for (const [relPath, content] of Object.entries(files)) {
  const fullPath = path.join(src, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim());
}

console.log('All files generated successfully.');
