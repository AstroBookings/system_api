import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../api/authentication/models/user.type';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, JwtService],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const user: User = {
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
        user,
      });
      // expect(result).toBe(mockToken);
    });
  });
});
