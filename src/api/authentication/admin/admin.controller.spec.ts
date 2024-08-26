import { Test, TestingModule } from '@nestjs/testing';
import { UserToken } from '../models/user-token.type';
import { AuthenticationService } from '../services/authentication.service';
import { AdminController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminController;
  let mockedAuthService: jest.Mocked<Partial<AuthenticationService>>;

  beforeEach(async () => {
    const mockedUserToken: UserToken = {
      user: {
        id: '1',
        name: 'John Doe',
        email: 'john.doe@test.dev',
        role: 'traveler',
      },
      token: 'mocked_jwt_token',
    };
    mockedAuthService = {};
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockedAuthService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
