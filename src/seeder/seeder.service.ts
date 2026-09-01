import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entities/role.entity';
import { User } from '../user/entity/user.entity';
import { UsersService } from '../user/user.service';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);
  
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private usersService: UsersService,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('🌱 Starting Database Seeding...');
    
    // Seed Roles
    const roles = ['Admin', 'SuperEmployee', 'Employee'];
    let adminRole = await this.roleRepo.findOne({ where: { name: 'Admin' } });
    
    for (const roleName of roles) {
      const exists = await this.roleRepo.findOne({ where: { name: roleName } });
      if (!exists) {
        const newRole = this.roleRepo.create({ name: roleName });
        const savedRole = await this.roleRepo.save(newRole);
        this.logger.log(`✅ Created Role: ${roleName}`);
        if (roleName === 'Admin') adminRole = savedRole;
      }
    }

    // Seed Admin User
    const adminExists = await this.userRepo.findOne({ where: { email: 'admin@crm.com' } });
    if (!adminExists) {
      await this.usersService.create({
        fullName: 'System Administrator',
        email: 'admin@crm.com',
        phone: '01000000000',
        password: 'AdminPassword123!',
        salary: 0,
        roleId: adminRole?.id,
      });
      this.logger.log('✅ Created Default Admin User: admin@crm.com');
    }
    
    this.logger.log('🌲 Database Seeding Completed!');
  }
}
