import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from '@shared/id.service';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { TokenPayload, UserToken } from '../models/user-token.type';
import { AuthenticationService } from './authentication.service';
import { HashService } from './hash.service';
import { TokenService } from './token.service';
import { UserEntity, UserEntityData } from './user.entity';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockUserRepository: Partial<jest.Mocked<EntityRepository<UserEntityData>>>;
  let mockTokenService: Partial<jest.Mocked<TokenService>>;
  let mockHashService: Partial<jest.Mocked<HashService>>;
  let mockIdService: Partial<jest.Mocked<IdService>>;
  const mockId: string = '1';
  const mockHashedPassword: string = 'hashed_password';
  const mockToken: string = 'mock_token';
  const mockIat: number = 1756074366;
  const mockExp: number = 1756074366;
  const mockTokenPayload: TokenPayload = {
    sub: mockId,
    iat: mockIat,
    exp: mockExp,
  };
  const inputValidLoginDto: LoginDto = {
    email: 'john.doe@test.dev',
    password: 'Password@123',
  };
  const inputInvalidLoginDto: LoginDto = {
    email: 'john.doe@test.dev',
    password: 'WrongPassword@123',
  };
  const inputValidRegisterDto: RegisterDto = {
    name: 'John Doe',
    email: inputValidLoginDto.email,
    password: inputValidLoginDto.password,
    role: 'traveler',
  };
  const mockUserEntity: UserEntityData = {
    id: mockId,
    name: inputValidRegisterDto.name,
    email: inputValidRegisterDto.email,
    passwordHash: mockHashedPassword,
    role: inputValidRegisterDto.role,
  };

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };
    mockTokenService = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
      decodeToken: jest.fn(),
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
      const expected_result: UserToken = {
        user: {
          id: mockId,
          name: inputValidRegisterDto.name,
          email: inputValidRegisterDto.email,
          role: inputValidRegisterDto.role,
        },
        token: mockToken,
        exp: mockExp,
      };

      mockUserRepository.findOne.mockResolvedValue(null);
      mockHashService.hashText.mockReturnValue(mockHashedPassword);
      mockIdService.generateId.mockReturnValue(mockId);
      mockTokenService.generateToken.mockReturnValue(mockToken);
      mockTokenService.decodeToken.mockReturnValue(mockTokenPayload);

      // Act
      const actual_result: UserToken = await service.register(inputValidRegisterDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: inputValidRegisterDto.email,
      });
      expect(mockUserRepository.insert).toHaveBeenCalled();
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockId);
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw Exception if user already exists', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUserEntity);

      // Act & Assert
      await expect(service.register(inputValidRegisterDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: inputValidRegisterDto.email,
      });
    });
  });

  describe('login', () => {
    it('should log in a user with correct credentials', async () => {
      // Arrange
      const expected_result: UserToken = {
        user: {
          id: mockUserEntity.id,
          name: mockUserEntity.name,
          email: mockUserEntity.email,
          role: mockUserEntity.role,
        },
        token: mockToken,
        exp: mockExp,
      };

      mockUserRepository.findOne.mockResolvedValue(mockUserEntity);
      mockHashService.isValid.mockReturnValue(true);
      mockTokenService.generateToken.mockReturnValue(mockToken);
      mockTokenService.decodeToken.mockReturnValue(mockTokenPayload);

      // Act
      const actual_result: UserToken = await service.login(inputValidLoginDto);

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: inputValidLoginDto.email,
      });
      expect(mockHashService.isValid).toHaveBeenCalledWith(inputValidLoginDto.password, mockUserEntity.passwordHash);
      expect(mockTokenService.generateToken).toHaveBeenCalledWith(mockUserEntity.id);
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUserEntity);
      mockHashService.isValid.mockReturnValue(false);

      // Act & Assert
      await expect(service.login(inputInvalidLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: inputInvalidLoginDto.email,
      });
      expect(mockHashService.isValid).toHaveBeenCalledWith(inputInvalidLoginDto.password, mockUserEntity.passwordHash);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      // Arrange

      mockUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(inputInvalidLoginDto)).rejects.toThrow(UnauthorizedException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        email: inputInvalidLoginDto.email,
      });
    });
  });

  describe('validate', () => {
    it('should validate a token successfully', async () => {
      // Arrange
      const inputToken: string = mockToken;
      const expectedUserToken: UserToken = {
        user: {
          id: mockUserEntity.id,
          name: mockUserEntity.name,
          email: mockUserEntity.email,
          role: mockUserEntity.role,
        },
        token: mockToken,
        exp: mockExp,
      };

      mockTokenService.validateToken.mockReturnValue(mockTokenPayload);
      mockUserRepository.findOne.mockResolvedValue(mockUserEntity);

      // Act
      const actualUserToken: UserToken = await service.validate(inputToken);

      // Assert
      expect(mockTokenService.validateToken).toHaveBeenCalledWith(inputToken);
      expect(actualUserToken).toEqual(expectedUserToken);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      // Arrange
      const inputToken: string = mockToken;

      mockTokenService.validateToken = jest.fn().mockImplementation(() => {
        throw new UnauthorizedException('Invalid token');
      });

      // Act & Assert
      await expect(service.validate(inputToken)).rejects.toThrow(UnauthorizedException);
      expect(mockTokenService.validateToken).toHaveBeenCalledWith(inputToken);
    });
  });
});
