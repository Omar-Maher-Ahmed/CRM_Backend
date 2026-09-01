import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealService } from './deal.service';
import { DealResolver } from './deal.resolver';
import { Deal } from './entities/deal.entity';
import { DealProduct } from './entities/deal-product.entity';
@Module({ imports: [TypeOrmModule.forFeature([Deal, DealProduct])], providers: [DealResolver, DealService], exports: [DealService] })
export class DealModule {}