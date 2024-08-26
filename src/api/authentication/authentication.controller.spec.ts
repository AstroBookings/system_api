import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserToken } from './models/user-token.type';
import { AuthenticationService } from './services/authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let stubAuthService: Partial<jest.Mocked<AuthenticationService>>;

  const stubId: string = '1';
  const stubToken: string = 'stub_jwt_token';
  const stubExp: number = 1756074366;
  const inputValidLoginDto: LoginDto = {
    email: 'john.doe@test.dev',
    password: 'Password@123',
  };
  const inputValidRegisterDto: RegisterDto = {
    name: 'John Doe',
    email: inputValidLoginDto.email,
    password: inputValidLoginDto.password,
    role: 'traveler',
  };
  const stubUserToken: UserToken = {
    user: {
      id: stubId,
      name: inputValidRegisterDto.name,
      email: inputValidRegisterDto.email,
      role: inputValidRegisterDto.role,
    },
    token: stubToken,
    exp: stubExp,
  };

  beforeEach(async () => {
    stubAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      validate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: stubAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      stubAuthService.register.mockResolvedValue(stubUserToken);

      // Act
      const actualResult: UserToken = await controller.register(
        inputValidRegisterDto,
      );

      // Assert
      expect(stubAuthService.register).toHaveBeenCalledWith(
        inputValidRegisterDto,
      );
      expect(actualResult).toEqual(stubUserToken);
    });

    it('should throw conflict exception when registering with an existing email', async () => {
      // Arrange
      stubAuthService.register.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      // Act & Assert
      await expect(controller.register(inputValidRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      expect(stubAuthService.register).toHaveBeenCalledWith(
        inputValidRegisterDto,
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      stubAuthService.login.mockResolvedValue(stubUserToken);

      // Act
      const actualResult: UserToken =
        await controller.login(inputValidLoginDto);

      // Assert
      expect(stubAuthService.login).toHaveBeenCalledWith(inputValidLoginDto);
      expect(actualResult).toEqual(stubUserToken);
    });

    it('should throw unauthorized exception when logging in with invalid credentials', async () => {
      // Arrange
      stubAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(inputValidLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(stubAuthService.login).toHaveBeenCalledWith(inputValidLoginDto);
    });
  });

  describe('validate', () => {
    it('should validate a token successfully', async () => {
      // Arrange
      stubAuthService.validate.mockResolvedValue(stubUserToken);

      // Act
      const actualResult: UserToken = await controller.validate(stubToken);

      // Assert
      expect(stubAuthService.validate).toHaveBeenCalledWith(stubToken);
      expect(actualResult).toEqual(stubUserToken);
    });

    it('should throw unauthorized exception when validating an invalid token', async () => {
      // Arrange
      stubAuthService.validate.mockRejectedValue(
        new UnauthorizedException('Invalid token'),
      );

      // Act & Assert
      await expect(controller.validate(stubToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(stubAuthService.validate).toHaveBeenCalledWith(stubToken);
    });
  });
});
