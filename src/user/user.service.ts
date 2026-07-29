import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
        isActive: true,
    });
    }

    // Create User
    async create(dto: CreateUserInput) {
            await this.validateCreateUser(dto);
            
            const passwordHash = await this.passwordHash(dto.password);

            const user = this.buildUser(dto, passwordHash);

            return this.userRepository.save(user);
    }
    


    // Get ALL Users

    private async getUsers(): Promise<User[]> {
        return this.userRepository.find();
    }
    
    async findAll(): Promise<User[]> {
        return this.getUsers()
    }

    // Get User By Id

    private async getUserOrThrow(id: number): Promise<User>{
    const user = await this.userRepository.findOne({
        where: { id },

    });
        if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
    }


    // Get User With Password
    private async getUserWithPasswordOrThrow(
    id: number,
    ): Promise<User> {
    const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('user.id = :id', { id })
        .getOne();

    if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
    }

    async findOne(id: number): Promise<User> {
        return this.getUserOrThrow(id)
    }


// Update User []
    private async validateUpdateUser(
        user: User,
        dto: UpdateUserInput,
    ): Promise<void>{}

    private applyUserUpdates(
        user: User,
        dto: UpdateUserInput,
    ): User {
    // Object.assign(user, dto);
    // return user;

     if (dto.fullName !== undefined) {
        user.fullName = dto.fullName;
    }

    if (dto.email !== undefined) {
        user.email = dto.email;
    }

    if (dto.phone !== undefined) {
        user.phone = dto.phone;
    }

    if (dto.salary !== undefined) {
        user.salary = dto.salary;
    }
    return user;
    }

    async updateUser(
        id: number,
        dto: UpdateUserInput,
    ): Promise<User> {
        const user = await this.getUserOrThrow(id);

        await this.validateUpdateUser(user, dto);

        this.applyUserUpdates(user, dto);

        return this.userRepository.save(user);
    }

// Update Password[]
    private async verifyCurrentPassword(
    user: User,
    currentPassword: string,
    ): Promise<void> {
    
    console.log('currentPassword:', currentPassword);
    console.log('passwordHash:', user.passwordHash);
    console.log(user);
        const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,);
          
        if (!isPasswordValid) {
    throw new UnauthorizedException('Current password is incorrect.');
  }
    }

    private async validateUpdatePasswordUser(
    user: User,
    dto: UpdatePasswordInput,
    ): Promise<void> {
        await this.verifyCurrentPassword(user, dto.currentPassword);

        if (dto.newPassword !== dto.confirmPassword) {
            throw new BadRequestException(
            'New password and confirm password do not match.',
            );
        }

        if (dto.currentPassword === dto.newPassword) {
            throw new BadRequestException(
            'New password must be different from current password.',
            );
        }
    }

    async updatePassword(
        id: number,
        dto: UpdatePasswordInput,
    ): Promise<void> {
        const user = await this.getUserWithPasswordOrThrow(id);

        await this.validateUpdatePasswordUser(user, dto);

        const passwordHash = await this.passwordHash(dto.newPassword);

        user.passwordHash = passwordHash;

        await this.userRepository.save(user);
    }

// Delete User[]
// Delete Customer[]

}

