import { Injectable, NotFoundException } from '@nestjs/common';
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
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, input);
    return this.repo.save(product);
  }
  async remove(id: number) { await this.repo.delete(id); return true; }
}