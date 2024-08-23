import { Test, TestingModule } from '@nestjs/testing';

import { EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { HashService } from '../shared/hash.service';
import { IdService } from '../shared/id.service';
import { TokenService } from '../shared/token.service';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { User } from './models/user.entity';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockUserRepository: Partial<EntityRepository<User>>;
  let mockTokenService: Partial<TokenService>;
  let mockHashService: Partial<HashService>;
  let mockIdService: Partial<IdService>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(),
      insert: jest.fn(),
    };
    mockTokenService = {
      generateToken: jest.fn(() => 'mocked_token'),
    };
    mockHashService = {
      hashText: jest.fn(() => ''),
    };
    mockIdService = {
      generateId: jest.fn(() => '1'),
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

  it('should register a user', async () => {
    // Arrange
    const input_registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
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
});
