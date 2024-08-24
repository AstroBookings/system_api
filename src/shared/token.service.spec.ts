import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UserDto } from '../authentication/models/user.dto';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const user: UserDto = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'agency',
      };

      const mockToken: string = 'mockToken';
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result: string = tokenService.generateToken(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
      expect(result).toBe(mockToken);
    });
  });
});
