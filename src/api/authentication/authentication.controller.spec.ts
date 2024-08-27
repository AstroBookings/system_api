import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserToken } from './models/user-token.type';
import { AuthenticationService } from './services/authentication.service';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let mockAuthService: Partial<jest.Mocked<AuthenticationService>>;

  const mockId: string = '1';
  const mockToken: string = 'mock_jwt_token';
  const mockExp: number = 1756074366;
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
  const mockUserToken: UserToken = {
    user: {
      id: mockId,
      name: inputValidRegisterDto.name,
      email: inputValidRegisterDto.email,
      role: inputValidRegisterDto.role,
    },
    token: mockToken,
    exp: mockExp,
  };

  beforeEach(async () => {
    mockAuthService = {
      register: jest.fn(),
      login: jest.fn(),
      validate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      mockAuthService.register.mockResolvedValue(mockUserToken);

      // Act
      const actualResult: UserToken = await controller.register(
        inputValidRegisterDto,
      );

      // Assert
      expect(mockAuthService.register).toHaveBeenCalledWith(
        inputValidRegisterDto,
      );
      expect(actualResult).toEqual(mockUserToken);
    });

    it('should throw conflict exception when registering with an existing email', async () => {
      // Arrange
      mockAuthService.register.mockRejectedValue(
        new ConflictException('Email already in use'),
      );

      // Act & Assert
      await expect(controller.register(inputValidRegisterDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockAuthService.register).toHaveBeenCalledWith(
        inputValidRegisterDto,
      );
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      mockAuthService.login.mockResolvedValue(mockUserToken);

      // Act
      const actualResult: UserToken =
        await controller.login(inputValidLoginDto);

      // Assert
      expect(mockAuthService.login).toHaveBeenCalledWith(inputValidLoginDto);
      expect(actualResult).toEqual(mockUserToken);
    });

    it('should throw unauthorized exception when logging in with invalid credentials', async () => {
      // Arrange
      mockAuthService.login.mockRejectedValue(
        new UnauthorizedException('Invalid credentials'),
      );

      // Act & Assert
      await expect(controller.login(inputValidLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(inputValidLoginDto);
    });
  });

  describe('validate', () => {
    it('should validate a token successfully', async () => {
      // Arrange
      mockAuthService.validate.mockResolvedValue(mockUserToken);

      // Act
      const actualResult: UserToken = await controller.validate(mockToken);

      // Assert
      expect(mockAuthService.validate).toHaveBeenCalledWith(mockToken);
      expect(actualResult).toEqual(mockUserToken);
    });

    it('should throw unauthorized exception when validating an invalid token', async () => {
      // Arrange
      mockAuthService.validate.mockRejectedValue(
        new UnauthorizedException('Invalid token'),
      );

      // Act & Assert
      await expect(controller.validate(mockToken)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.validate).toHaveBeenCalledWith(mockToken);
    });
  });
});
