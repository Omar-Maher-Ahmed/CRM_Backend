import { Injectable, NotFoundException } from '@nestjs/common';
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
  async findOne(id: number) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Deal Stage not found');
    return record;
  }
  async update(id: number, input: UpdateDealStageInput) {
    const item = await this.findOne(id);
    if (!item) throw new NotFoundException('DealStage not found');
    Object.assign(item, input);
    return this.repo.save(item);
  }
  async remove(id: number) { await this.repo.delete(id); return true; }
}