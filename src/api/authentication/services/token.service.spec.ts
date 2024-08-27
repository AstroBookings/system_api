import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../models/user.type';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let tokenService: TokenService;
  let mockJwtService: Partial<jest.Mocked<JwtService>>;

  const mockId: string = '1';
  const mockToken: string = 'mock_token';
  const mockIat: number = 1756074366;
  const mockExp: number = 1756074366;
  const mockTokenPayload = {
    sub: mockId,
    iat: mockIat,
    exp: mockExp,
  };
  const mockUser: User = {
    id: mockId,
    name: 'John Doe',
    email: 'john.doe@test.dev',
    role: 'traveler',
  };

  const jwtConfig = {
    secret: 'secret',
    signOptions: { expiresIn: '1y' },
  };

  beforeEach(async () => {
    mockJwtService = {
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
          useValue: mockJwtService,
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
      mockJwtService.sign.mockReturnValue(mockToken);
      mockJwtService.verify.mockReturnValue(mockTokenPayload);

      // Act
      const actualToken: string = tokenService.generateToken(mockUser.id);

      // Assert
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
      expect(actualToken).toBe(mockToken);
      const actualDecoded = mockJwtService.verify(actualToken);
      expect(actualDecoded).toEqual(mockTokenPayload);
      expect(actualDecoded.sub).toBe(mockUser.id);
    });
  });

  describe('validateToken', () => {
    it('should validate a token', () => {
      // Arrange
      mockJwtService.verify.mockReturnValue(mockTokenPayload);

      // Act
      const actualSub: string = tokenService.validateToken(mockToken).sub;

      // Assert
      expect(actualSub).toEqual(mockTokenPayload.sub);
    });

    it('should throw an error if the token is invalid', () => {
      // Arrange
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      expect(() => tokenService.validateToken(mockToken)).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode a token', () => {
      // Arrange
      mockJwtService.decode.mockReturnValue(mockTokenPayload);

      // Act
      const actualSub: string = tokenService.decodeToken(mockToken).sub;

      // Assert
      expect(actualSub).toEqual(mockTokenPayload.sub);
    });
  });
});
