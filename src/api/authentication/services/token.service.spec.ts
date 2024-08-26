import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../models/user.type';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let stubJwtService: Partial<jest.Mocked<JwtService>>;

  const stubId: string = '1';
  const stubToken: string = 'stub_token';
  const stubIat: number = 1756074366;
  const stubExp: number = 1756074366;
  const stubTokenPayload = {
    sub: stubId,
    iat: stubIat,
    exp: stubExp,
  };
  const stubUser: User = {
    id: stubId,
    name: 'John Doe',
    email: 'john.doe@test.dev',
    role: 'traveler',
  };

  const jwtConfig = {
    secret: 'secret',
    signOptions: { expiresIn: '1y' },
  };

  beforeEach(async () => {
    stubJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
      decode: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register(jwtConfig)],
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: stubJwtService,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      // Arrange
      stubJwtService.sign.mockReturnValue(stubToken);
      stubJwtService.verify.mockReturnValue(stubTokenPayload);

      // Act
      const actualToken: string = tokenService.generateToken(stubUser.id);

      // Assert
      expect(stubJwtService.sign).toHaveBeenCalledWith({ sub: stubUser.id });
      expect(actualToken).toBe(stubToken);
      const actualDecoded = stubJwtService.verify(actualToken);
      expect(actualDecoded).toEqual(stubTokenPayload);
      expect(actualDecoded.sub).toBe(stubUser.id);
    });
  });

  describe('validateToken', () => {
    it('should validate a token', () => {
      // Arrange
      stubJwtService.verify.mockReturnValue(stubTokenPayload);

      // Act
      const actualSub: string = tokenService.validateToken(stubToken).sub;

      // Assert
      expect(actualSub).toEqual(stubTokenPayload.sub);
    });

    it('should throw an error if the token is invalid', () => {
      // Arrange
      stubJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      expect(() => tokenService.validateToken(stubToken)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', () => {
      // Arrange
      stubJwtService.decode.mockReturnValue(stubTokenPayload);

      // Act
      const actualSub: string = tokenService.decodeToken(stubToken).sub;

      // Assert
      expect(actualSub).toEqual(stubTokenPayload.sub);
    });
  });
});
