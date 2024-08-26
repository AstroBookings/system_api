import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from '../../../shared/id.service';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { UserToken } from '../models/user-token.type';
import { AuthenticationService } from './authentication.service';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { UserEntity, UserEntityData } from './user.entity';

// ToDo: fix error and failing test.

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockUserRepository: Partial<
    jest.Mocked<EntityRepository<UserEntityData>>
  >;
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
          provide: getRepositoryToken(UserEntity),
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
        name: 'John Doe',
        email: 'john.doe@test.dev',
        password: 'Password@123',
        role: 'traveler',
      };
      const expected_result: UserToken = {
        user: {
          id: '1',
          name: input_registerDto.name,
          email: input_registerDto.email,
          role: input_registerDto.role,
        },
        token: 'mocked_token',
        exp: 1756074366,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockHashService.hashText.mockReturnValue('hashed_password');
      mockIdService.generateId.mockReturnValue('1');
      mockTokenService.generateToken.mockReturnValue('mocked_token');

      // Act
      const actual_result: UserToken =
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
        name: 'John Doe',
        email: 'john.doe@test.dev',
        password: 'Password@123',
        role: 'traveler',
      };
      const userEntity: UserEntityData = {
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
        email: 'john.doe@test.dev',
        password: 'Password@123',
      };
      const userEntity: UserEntityData = {
        id: '1',
        name: 'John Doe',
        email: input_loginDto.email,
        passwordHash: 'hashed_password',
        role: 'agency',
      };
      const expected_result: UserToken = {
        user: {
          id: userEntity.id,
          name: userEntity.name,
          email: userEntity.email,
          role: userEntity.role,
        },
        token: 'mocked_token',
        exp: 1756074366,
      };

      mockUserRepository.findOne.mockResolvedValue(userEntity);
      mockHashService.isValid.mockReturnValue(true);
      mockTokenService.generateToken.mockReturnValue('mocked_token');

      // Act
      const actual_result: UserToken = await service.login(input_loginDto);

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
        email: 'john.doe@test.dev',
        password: 'WrongPassword@123',
      };
      const userEntity: UserEntityData = {
        id: '1',
        name: 'John Doe',
        email: input_loginDto.email,
        passwordHash: 'hashed_password',
        role: 'traveler',
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
        email: 'non.existent@test.dev',
        password: 'Password@123',
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

  describe('validate', () => {
    it('should validate a token successfully', async () => {
      // Arrange
      const input_token: string = 'valid_token';
      const mockExpectedResult: UserToken = {
        user: null,
        token: 'mocked_token',
        exp: 1756074366,
      };

      mockTokenService.validateToken = jest
        .fn()
        .mockReturnValue(mockExpectedResult);

      // Act
      const result = await service.validate(input_token);

      // Assert
      expect(mockTokenService.validateToken).toHaveBeenCalledWith(input_token);
      //expect(result).toEqual(mockExpectedResult);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      // Arrange
      const input_token: string = 'invalid_token';

      mockTokenService.validateToken = jest.fn().mockImplementation(() => {
        throw new UnauthorizedException('Invalid token');
      });

      // Act & Assert
      await expect(service.validate(input_token)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockTokenService.validateToken).toHaveBeenCalledWith(input_token);
    });
  });
});
