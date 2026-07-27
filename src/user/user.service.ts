import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {   
    CreateUserInput,
  UpdateUserInput,
  UpdatePasswordInput,
 } from "./dto"
@Injectable()
export class UsersService {
    constructor( 
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    /*
    1. Validate
    2. Hash Password
    3. Build User
    4. Save
    5. Return
    */

//checkEmailExists
    private async checkEmailExists(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
        where: { email },
    });

    if (existingUser) {
        throw new ConflictException('Email already exists');
    }
    }


//checkPhoneExists
    private async checkPhoneExists(phone: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({
        where: { phone },
    });

    if (existingUser) {
        throw new ConflictException('Phone already exists');
    }
    }

//validateCreateUser
    private async validateCreateUser(dto: CreateUserInput): Promise<void>
    {
    await this.checkEmailExists(dto.email);
    await this.checkPhoneExists(dto.phone);
    }

    private async passwordHash(Password: string): Promise<string>{
        return bcrypt.hash(Password,10);
    }

    // const user = new User(); بدل من استخدام الطريقه القديمة فى انشاء Object 
    // Logging comming soon 
    // buildUser دى layer عشان لما احب اضيف اى حاجه زى مثلا Logging 
    private buildUser(
        dto: CreateUserInput,
        passwordHash : string,
    ){
        return this.userRepository.create({
        ...dto,
        passwordHash,
    });
    }

// Create User
    async create(dto: CreateUserInput) {
            await this.validateCreateUser(dto);
            
            const passwordHash = await this.passwordHash(dto.password);

            const user = this.buildUser(dto, passwordHash);

            return this.userRepository.save(user);
        }
    


  findAll(): string {
    return 'Hello from Users Service !';
  }

  Create(data: CreateUserInput): string {
    return 'Create user'
  }

}

