import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DealStageService } from './deal-stage.service';
import { DealStageResolver } from './deal-stage.resolver';
import { DealStage } from './entities/deal-stage.entity';
@Module({ imports: [TypeOrmModule.forFeature([DealStage])], providers: [DealStageResolver, DealStageService], exports: [DealStageService] })
export class DealStageModule {}