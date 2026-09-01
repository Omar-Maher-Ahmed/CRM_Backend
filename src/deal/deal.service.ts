import { Injectable, NotFoundException } from '@nestjs/common';
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
}