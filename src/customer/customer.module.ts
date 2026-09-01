import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerService } from './customer.service';
import { CustomerResolver } from './customer.resolver';
import { Customer } from './entities/customer.entity';
@Module({ imports: [TypeOrmModule.forFeature([Customer])], providers: [CustomerResolver, CustomerService], exports: [CustomerService] })
export class CustomerModule {}