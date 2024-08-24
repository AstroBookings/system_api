import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../api/authentication/models/user.type';
import { SharedModule } from './shared.module';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
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
      const inputUser: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'agency',
      };
      jest.spyOn(jwtService, 'sign');
      const actualToken: string = tokenService.generateToken(inputUser);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: inputUser.id });
      const actualDecoded = jwtService.verify(actualToken);
      expect(actualDecoded.sub).toBe(inputUser.id);
    });
  });
});
