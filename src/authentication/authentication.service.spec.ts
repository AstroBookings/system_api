import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { User } from './models/user.entity';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let mockUserRepository: Partial<Repository<User>>;
  let mockJwtService: Partial<JwtService>;

  beforeEach(async () => {
    mockUserRepository = {
      findOne: jest.fn(() => null),
      create: jest.fn().mockImplementation((dto: RegisterDto) => ({
        id: 1,
        name: dto.name,
        email: dto.email,
        passwordHash: 'hashedPassword',
        role: dto.role
      })),
      save: jest.fn().mockImplementation((user: User) => Promise.resolve(user)),
    };
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked_token'),
    };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        AuthenticationService,
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should register a user', async () => {
    const input_registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'agency'
    };

    const expected_result: UserTokenDto = {
      user: {
        id: '1',
        name: input_registerDto.name,
        email: input_registerDto.email,
        role: input_registerDto.role
      },
      token: 'mocked_token'
    };

    const actual_result: UserTokenDto = await service.register(input_registerDto);

    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(mockUserRepository.save).toHaveBeenCalled();
    expect(mockJwtService.sign).toHaveBeenCalledWith({ 
      sub: expected_result.user.id.toString(), 
      email: expected_result.user.email, 
      name: expected_result.user.name, 
      role: expected_result.user.role 
    });

    expect(actual_result).toEqual(expected_result);
  });
});