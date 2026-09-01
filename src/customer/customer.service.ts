import { Injectable, NotFoundException } from '@nestjs/common';
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
}