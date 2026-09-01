import { Injectable, NotFoundException } from '@nestjs/common';
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
  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Activity not found');
    return record;
  }
  
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
}