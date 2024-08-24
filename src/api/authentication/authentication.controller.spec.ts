import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserToken } from './models/user-token.type';
import { ValidToken } from './models/valid-token.type';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let mockedAuthService: jest.Mocked<Partial<AuthenticationService>>;
  const mockedUserToken: UserToken = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@test.dev',
      role: 'traveler',
    },
    token: 'mocked_jwt_token',
  };
  const mockExpiresAt = new Date();
  beforeEach(async () => {
    mockedAuthService = {
      register: jest.fn(async (x) => {
        if (x.email == 'repeated@test.dev')
          throw new ConflictException('Email already in use');
        return mockedUserToken;
      }),
      login: jest.fn(async (x) => {
        if (x.email == 'non.existent@test.dev')
          throw new UnauthorizedException('Invalid credentials');
        if (x.email == 'john.doe@test.dev' && x.password == 'WrongPassword@123')
          throw new UnauthorizedException('Invalid credentials');
        return mockedUserToken;
      }),
      validate: jest.fn(async (x) => {
        if (x == 'mocked_jwt_token') {
          const validToken: ValidToken = {
            user: mockedUserToken.user,
            token: mockedUserToken.token,
            expiresAt: mockExpiresAt,
          };
          return validToken;
        }
        throw new UnauthorizedException('Invalid token');
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
    mockedAuthService = module.get(AuthenticationService);
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'john.doe@test.dev',
        password: 'Password@123',
        role: 'traveler',
      };

      // Act
      const actual_result: UserToken = await controller.register(registerDto);

      // Assert
      expect(mockedAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(actual_result).toEqual(mockedUserToken);
    });

    it('should throw conflict exception when registering with an existing email', async () => {
      // Arrange
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'repeated@test.dev',
        password: 'Password@123',
        role: 'traveler',
      };

      // Act & Assert
      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already in use',
      );
      expect(mockedAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('User Login', () => {
    it('should login a user successfully', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john.doe@test.dev',
        password: 'Password@123',
      };

      // Act
      const actual_result: UserToken = await controller.login(loginDto);

      // Assert
      expect(mockedAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(actual_result).toEqual(mockedUserToken);
    });

    it('should throw unauthorized exception when logging in with not registered email', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'non.existent@test.dev',
        password: 'WrongPassword@123',
      };

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockedAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should throw unauthorized exception when logging in with wrong password', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'john.doe@test.dev',
        password: 'WrongPassword@123',
      };

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
      expect(mockedAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('Token Validation', () => {
    it('should validate a token successfully', async () => {
      // Arrange
      const token: string = 'mocked_jwt_token';

      // Act
      const actual_result: ValidToken = await controller.validate(token);

      // Assert
      expect(mockedAuthService.validate).toHaveBeenCalledWith(token);
      const expected_result: ValidToken = {
        user: mockedUserToken.user,
        token: mockedUserToken.token,
        expiresAt: mockExpiresAt,
      };
      expect(actual_result).toEqual(expected_result);
    });

    it('should throw unauthorized exception when validating an invalid token', async () => {
      // Arrange
      const token: string = 'invalid_token';

      // Act & Assert
      await expect(controller.validate(token)).rejects.toThrow('Invalid token');
      expect(mockedAuthService.validate).toHaveBeenCalledWith(token);
    });
  });
});
