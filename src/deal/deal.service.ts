import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Deal } from './entities/deal.entity';
import { DealProduct } from './entities/deal-product.entity';
import { CreateDealInput } from './dto/create-deal.input';
import { UpdateDealInput } from './dto/update-deal.input';

@Injectable()
export class DealService {
  constructor(
    @InjectRepository(Deal) private repo: Repository<Deal>,
    @InjectRepository(DealProduct) private dpRepo: Repository<DealProduct>,
    private dataSource: DataSource
  ) {}
  
  async create(input: CreateDealInput) {
    // 1. نستخدم Transaction لضمان أنه إما يتم حفظ الصفقة مع منتجاتها، أو يتم التراجع عن كل شيء (Rollback)
    return await this.dataSource.transaction(async transactionalEntityManager => {
      const deal = transactionalEntityManager.create(Deal, {
        title: input.title,
        value: input.value,
        customer: input.customerId ? { id: input.customerId } as any : null,
        owner: input.ownerId ? { id: input.ownerId } as any : null,
        stage: input.stageId ? { id: input.stageId } as any : null,
      });
      const savedDeal = await transactionalEntityManager.save(Deal, deal);
      
      if (input.products && input.products.length > 0) {
        const dealProducts = input.products.map(p => transactionalEntityManager.create(DealProduct, {
          dealId: savedDeal.id,
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          totalPrice: p.totalPrice,
        }));
        await transactionalEntityManager.save(DealProduct, dealProducts);
      }
      return await transactionalEntityManager.findOne(Deal, { where: { id: savedDeal.id } });
    });
  }
  
  findAll() { return this.repo.find(); }
  
  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Deal not found');
    return record;
  }
  
  async update(id: number, input: UpdateDealInput) {
    return await this.dataSource.transaction(async transactionalEntityManager => {
      const deal = await transactionalEntityManager.findOne(Deal, { where: { id } });
      if (!deal) throw new NotFoundException('Deal not found');
      
      if (input.title !== undefined) deal.title = input.title;
      if (input.value !== undefined) deal.value = input.value;
      if (input.customerId !== undefined) deal.customer = input.customerId ? { id: input.customerId } as any : null;
      if (input.ownerId !== undefined) deal.owner = input.ownerId ? { id: input.ownerId } as any : null;
      if (input.stageId !== undefined) deal.stage = input.stageId ? { id: input.stageId } as any : null;
      
      await transactionalEntityManager.save(Deal, deal);
      
      if (input.products) {
        await transactionalEntityManager.delete(DealProduct, { dealId: id });
        const dealProducts = input.products.map(p => transactionalEntityManager.create(DealProduct, {
          dealId: id,
          productId: p.productId,
          quantity: p.quantity,
          unitPrice: p.unitPrice,
          totalPrice: p.totalPrice,
        }));
        await transactionalEntityManager.save(DealProduct, dealProducts);
      }
      return await transactionalEntityManager.findOne(Deal, { where: { id } });
    });
  }
  
  async remove(id: number) { await this.repo.delete(id); return true; }
}