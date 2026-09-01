import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from 'src/seeder/seeder.service';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User]), UserModule],
  providers: [SeederService],
})
export class SeederModule {}
