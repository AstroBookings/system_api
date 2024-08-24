import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { HashService } from '../shared/hash.service';
import { IdService } from '../shared/id.service';
import { TokenService } from '../shared/token.service';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { User, UserEntity } from './models/user.entity';

// ToDo: fix error and failing test.

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockUserRepository: Partial<jest.Mocked<EntityRepository<User>>>;
  let mockTokenService: Partial<jest.Mocked<TokenService>>;
  let mockHashService: Partial<jest.Mocked<HashService>>;
  let mockIdService: Partial<jest.Mocked<IdService>>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };
    mockTokenService = {
      generateToken: jest.fn(),
    };
    mockHashService = {
      hashText: jest.fn(),
      isValid: jest.fn(),
    };
    mockIdService = {
      generateId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: HashService,
          useValue: mockHashService,
        },
        {
          provide: IdService,
          useValue: mockIdService,
        },
        AuthenticationService,
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('register', () => {
    it('should register a user', async () => {
      // Arrange
      const input_registerDto: RegisterDto = {
        name: 'Test New User',
        email: 'test@new.com',
        password: 'password',
        role: 'agency',
      };
      const expected_result: UserTokenDto = {
        user: {
          id: '1',
          name: input_registerDto.name,
          email: input_registerDto.email,
          role: input_registerDto.role,
        },
        token: 'mocked_token',
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockHashService.hashText.mockReturnValue('hashed_password');
      mockIdService.generateId.mockReturnValue('1');
      mockTokenService.generateToken.mockReturnValue('mocked_token');

      // Act
      const actual_result: UserTokenDto =
        await service.register(input_registerDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: input_registerDto.email,
      });
      expect(mockUserRepository.insert).toHaveBeenCalled();
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(
        expected_result.user,
      );
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw Exception if user already exists', async () => {
      // Arrange
      const input_registerDto: RegisterDto = {
        name: 'Test New User',
        email: 'test@new.com',
        password: 'password',
        role: 'agency',
      };
      const userEntity: UserEntity = {
        id: '1',
        name: input_registerDto.name,
        email: input_registerDto.email,
        passwordHash: 'hashed_password',
        role: input_registerDto.role,
      };
      mockUserRepository.findOne.mockResolvedValue(userEntity);

      // Act & Assert
      await expect(service.register(input_registerDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('login', () => {
    it('should log in a user with correct credentials', async () => {
      // Arrange
      const input_loginDto: LoginDto = {
        email: 'test@existing.com',
        password: 'password',
      };
      const userEntity: UserEntity = {
        id: '1',
        name: 'Test User',
        email: input_loginDto.email,
        passwordHash: 'hashed_password',
        role: 'agency',
      };
      const expected_result: UserTokenDto = {
        user: {
          id: userEntity.id,
          name: userEntity.name,
          email: userEntity.email,
          role: userEntity.role,
        },
        token: 'mocked_token',
      };

      mockUserRepository.findOne.mockResolvedValue(userEntity);
      mockHashService.isValid.mockReturnValue(true);
      mockTokenService.generateToken.mockReturnValue('mocked_token');

      // Act
      const actual_result: UserTokenDto = await service.login(input_loginDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: input_loginDto.email,
      });
      expect(mockHashService.isValid).toHaveBeenCalledWith(
        input_loginDto.password,
        userEntity.passwordHash,
      );
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(
        expected_result.user,
      );
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      const input_loginDto: LoginDto = {
        email: 'test@existing.com',
        password: 'wrongpassword',
      };
      const userEntity: UserEntity = {
        id: '1',
        name: 'Test User',
        email: input_loginDto.email,
        passwordHash: 'hashed_password',
        role: 'agency',
      };

      mockUserRepository.findOne.mockResolvedValue(userEntity);
      mockHashService.isValid.mockReturnValue(false);

      // Act & Assert
      await expect(service.login(input_loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: input_loginDto.email,
      });
      expect(mockHashService.isValid).toHaveBeenCalledWith(
        input_loginDto.password,
        userEntity.passwordHash,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      // Arrange
      const input_loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };

      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(input_loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: input_loginDto.email,
      });
    });
  });
});
