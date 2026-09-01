import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create user', () => {
    const createDto = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '1234567890',
      password: 'password123',
      salary: 1000,
    };

    it('should successfully create a new user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); 
      
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const createdUser = { id: 1, ...createDto, passwordHash: hashedPassword, isActive: true };
      mockUserRepository.create.mockReturnValue(createdUser);
      mockUserRepository.save.mockResolvedValue(createdUser);

      const result = await service.create(createDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledTimes(2); 
      expect(bcrypt.hash).toHaveBeenCalledWith(createDto.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findOne.mockImplementation(async ({ where }) => {
        if (where.email === createDto.email) return { id: 1, email: createDto.email };
        return null;
      });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
    
    it('should throw ConflictException if phone already exists', async () => {
      mockUserRepository.findOne.mockImplementation(async ({ where }) => {
        if (where.phone === createDto.phone) return { id: 2, phone: createDto.phone };
        return null;
      });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, fullName: 'Test User' };
      mockUserRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(1);
      expect(result).toEqual(user);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});
