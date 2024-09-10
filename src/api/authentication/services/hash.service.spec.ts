import * as crypto from 'crypto';
import { HashService } from './hash.service';

jest.mock('crypto');

describe('HashService', () => {
  let hashService: HashService;
  let mockCrypto: jest.Mocked<typeof crypto>;

  const mockPlainText: string = 'password123';
  const mockHashedText: string = 'hashed_password123';

  beforeEach(async () => {
    const mockHashObject = {
      update: jest.fn().mockReturnThis(),
      digest: jest.fn().mockReturnValue(mockHashedText),
    };

    mockCrypto = crypto as jest.Mocked<typeof crypto>;
    mockCrypto.createHash.mockReturnValue(mockHashObject as any);

    hashService = new HashService();
  });

  it('should be defined', () => {
    expect(hashService).toBeDefined();
  });

  describe('hashText', () => {
    it('should hash a given text', () => {
      // Arrange
      const inputText = mockPlainText;

      // Act
      const actualHash: string = hashService.hashText(inputText);

      // Assert
      expect(mockCrypto.createHash).toHaveBeenCalledWith('sha256');
      expect(actualHash).toBe(mockHashedText);
    });

    it('should produce different hashes for different inputs', () => {
      // Arrange
      const inputText1 = mockPlainText;
      const inputText2 = 'differentpassword';
      mockCrypto.createHash
        .mockReturnValueOnce({
          update: jest.fn().mockReturnThis(),
          digest: jest.fn().mockReturnValue('hash1'),
        } as any)
        .mockReturnValueOnce({
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
      const inputText = mockPlainText;
      const inputHash = mockHashedText;

      // Act
      const isValid: boolean = hashService.isValid(inputText, inputHash);

      // Assert
      expect(isValid).toBe(true);
    });

    it('should return false for non-matching text and hash', () => {
      // Arrange
      const inputText = mockPlainText;
      const inputHash = 'different_hash';

      // Act
      const isValid: boolean = hashService.isValid(inputText, inputHash);

      // Assert
      expect(isValid).toBe(false);
    });
  });
});
