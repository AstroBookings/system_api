import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from '../../../shared/id.service';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { TokenPayload, UserToken } from '../models/user-token.type';
import { UserEntity, UserEntityData } from '../repositories/user.entity';
import { AuthenticationService } from './authentication.service';
import { HashService } from './hash.service';
import { TokenService } from './token.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let stubUserRepository: Partial<
    jest.Mocked<EntityRepository<UserEntityData>>
  >;
  let stubTokenService: Partial<jest.Mocked<TokenService>>;
  let stubHashService: Partial<jest.Mocked<HashService>>;
  let stubIdService: Partial<jest.Mocked<IdService>>;
  const stubId: string = '1';
  const stubHashedPassword: string = 'hashed_password';
  const stubToken: string = 'stub_token';
  const stubIat: number = 1756074366;
  const stubExp: number = 1756074366;
  const stubTokenPayload: TokenPayload = {
    sub: stubId,
    iat: stubIat,
    exp: stubExp,
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
  const stubUserEntity: UserEntityData = {
    id: stubId,
    name: inputValidRegisterDto.name,
    email: inputValidRegisterDto.email,
    passwordHash: stubHashedPassword,
    role: inputValidRegisterDto.role,
  };

  beforeEach(async () => {
    stubUserRepository = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };
    stubTokenService = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
      decodeToken: jest.fn(),
    };
    stubHashService = {
      hashText: jest.fn(),
      isValid: jest.fn(),
    };
    stubIdService = {
      generateId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: stubUserRepository,
        },
        {
          provide: TokenService,
          useValue: stubTokenService,
        },
        {
          provide: HashService,
          useValue: stubHashService,
        },
        {
          provide: IdService,
          useValue: stubIdService,
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
          id: stubId,
          name: inputValidRegisterDto.name,
          email: inputValidRegisterDto.email,
          role: inputValidRegisterDto.role,
        },
        token: stubToken,
        exp: stubExp,
      };

      stubUserRepository.findOne.mockResolvedValue(null);
      stubHashService.hashText.mockReturnValue(stubHashedPassword);
      stubIdService.generateId.mockReturnValue(stubId);
      stubTokenService.generateToken.mockReturnValue(stubToken);
      stubTokenService.decodeToken.mockReturnValue(stubTokenPayload);

      // Act
      const actual_result: UserToken = await service.register(
        inputValidRegisterDto,
      );

      // Assert
      expect(stubUserRepository.findOne).toHaveBeenCalledWith({
        email: inputValidRegisterDto.email,
      });
      expect(stubUserRepository.insert).toHaveBeenCalled();
      expect(stubTokenService.generateToken).toHaveBeenCalledWith(stubId);
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw Exception if user already exists', async () => {
      // Arrange
      stubUserRepository.findOne.mockResolvedValue(stubUserEntity);

      // Act & Assert
      await expect(service.register(inputValidRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      expect(stubUserRepository.findOne).toHaveBeenCalledWith({
        email: inputValidRegisterDto.email,
      });
    });
  });

  describe('login', () => {
    it('should log in a user with correct credentials', async () => {
      // Arrange
      const expected_result: UserToken = {
        user: {
          id: stubUserEntity.id,
          name: stubUserEntity.name,
          email: stubUserEntity.email,
          role: stubUserEntity.role,
        },
        token: stubToken,
        exp: stubExp,
      };

      stubUserRepository.findOne.mockResolvedValue(stubUserEntity);
      stubHashService.isValid.mockReturnValue(true);
      stubTokenService.generateToken.mockReturnValue(stubToken);
      stubTokenService.decodeToken.mockReturnValue(stubTokenPayload);

      // Act
      const actual_result: UserToken = await service.login(inputValidLoginDto);

      // Assert
      expect(stubUserRepository.findOne).toHaveBeenCalledWith({
        email: inputValidLoginDto.email,
      });
      expect(stubHashService.isValid).toHaveBeenCalledWith(
        inputValidLoginDto.password,
        stubUserEntity.passwordHash,
      );
      expect(stubTokenService.generateToken).toHaveBeenCalledWith(
        stubUserEntity.id,
      );
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      // Arrange
      stubUserRepository.findOne.mockResolvedValue(stubUserEntity);
      stubHashService.isValid.mockReturnValue(false);

      // Act & Assert
      await expect(service.login(inputInvalidLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(stubUserRepository.findOne).toHaveBeenCalledWith({
        email: inputInvalidLoginDto.email,
      });
      expect(stubHashService.isValid).toHaveBeenCalledWith(
        inputInvalidLoginDto.password,
        stubUserEntity.passwordHash,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      // Arrange

      stubUserRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(inputInvalidLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(stubUserRepository.findOne).toHaveBeenCalledWith({
        email: inputInvalidLoginDto.email,
      });
    });
  });

  describe('validate', () => {
    it('should validate a token successfully', async () => {
      // Arrange
      const inputToken: string = stubToken;
      const expectedUserToken: UserToken = {
        user: {
          id: stubUserEntity.id,
          name: stubUserEntity.name,
          email: stubUserEntity.email,
          role: stubUserEntity.role,
        },
        token: stubToken,
        exp: stubExp,
      };

      stubTokenService.validateToken.mockReturnValue(stubTokenPayload);
      stubUserRepository.findOne.mockResolvedValue(stubUserEntity);

      // Act
      const actualUserToken: UserToken = await service.validate(inputToken);

      // Assert
      expect(stubTokenService.validateToken).toHaveBeenCalledWith(inputToken);
      expect(actualUserToken).toEqual(expectedUserToken);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      // Arrange
      const inputToken: string = stubToken;

      stubTokenService.validateToken = jest.fn().mockImplementation(() => {
        throw new UnauthorizedException('Invalid token');
      });

      // Act & Assert
      await expect(service.validate(inputToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(stubTokenService.validateToken).toHaveBeenCalledWith(inputToken);
    });
  });
});
