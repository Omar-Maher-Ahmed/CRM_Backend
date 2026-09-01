import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleInput: CreateRoleInput): Promise<Role> {
    const role = this.roleRepository.create(createRoleInput);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) throw new NotFoundException(`Role with id ${id} not found`);
    return role;
  }

  async update(id: number, updateRoleInput: UpdateRoleInput): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, updateRoleInput);
    return await this.roleRepository.save(role);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Role with id ${id} not found`);
    return true;
  }
}
