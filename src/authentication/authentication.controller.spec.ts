import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';

describe('AuthenticationController', () => {
  let controller: AuthenticationController;
  let authService: jest.Mocked<AuthenticationService>;
  const mockedUserToken: UserTokenDto = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'traveler',
    },
    token: 'mocked_jwt_token',
  };
  beforeEach(async () => {
    const mockAuthService = {
      register: jest.fn((x) => {
        if (x.email == 'johndoe@repeated.com')
          throw new ConflictException('Email already in use');
        return mockedUserToken;
      }),
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
    authService = module.get(AuthenticationService);
  });

  describe('User Registration', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'traveler',
      };
      const actual_result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(actual_result).toEqual(mockedUserToken);
    });

    it('should throw conflict exception when registering with an existing email', async () => {
      const registerDto: RegisterDto = {
        name: 'John Doe',
        email: 'johndoe@repeated.com',
        password: 'password123',
        role: 'traveler',
      };

      await expect(controller.register(registerDto)).rejects.toThrow(
        'Email already in use',
      );
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });
});
