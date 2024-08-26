import * as crypto from 'crypto';
import { HashService } from './hash.service';

jest.mock('crypto');

describe('HashService', () => {
  let hashService: HashService;
  let stubCrypto: jest.Mocked<typeof crypto>;

  const stubPlainText: string = 'password123';
  const stubHashedText: string = 'hashed_password123';

  beforeEach(async () => {
    const mockHashObject = {
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(stubHashedText),
    };

    stubCrypto = crypto as jest.Mocked<typeof crypto>;
    stubCrypto.createHash.mockReturnValue(mockHashObject as any);

    hashService = new HashService();
  });

  it('should be defined', () => {
    expect(hashService).toBeDefined();
  });

  describe('hashText', () => {
    it('should hash a given text', () => {
      // Arrange
      const inputText = stubPlainText;

      // Act
      const actualHash: string = hashService.hashText(inputText);

      // Assert
      expect(stubCrypto.createHash).toHaveBeenCalledWith('sha256');
      expect(actualHash).toBe(stubHashedText);
    });

    it('should produce different hashes for different inputs', () => {
      // Arrange
      const inputText1 = stubPlainText;
      const inputText2 = 'differentpassword';
      stubCrypto.createHash.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hash1'),
      } as any);
      stubCrypto.createHash.mockReturnValueOnce({
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValue('hash2'),
      } as any);

      // Act
      const hash1: string = hashService.hashText(inputText1);
      const hash2: string = hashService.hashText(inputText2);

      // Assert
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValid', () => {
    it('should return true for matching text and hash', () => {
      // Arrange
      const inputText = stubPlainText;
      const inputHash = stubHashedText;

      // Act
      const isValid: boolean = hashService.isValid(inputText, inputHash);

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return false for non-matching text and hash', () => {
      // Arrange
      const inputText = stubPlainText;
      const inputHash = 'different_hash';

      // Act
      const isValid: boolean = hashService.isValid(inputText, inputHash);

      // Assert
      expect(isValid).toBe(false);
    });
  });
});
