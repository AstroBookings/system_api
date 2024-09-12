import { hashText, isValid } from './hash.util';

describe('Hash Utility', () => {
  const plainText = 'password123';
  const hashedText = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

  describe('hashText', () => {
    it('should hash the given text', () => {
      const result = hashText(plainText);
      expect(result).toBe(hashedText);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashText('password1');
      const hash2 = hashText('password2');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValid', () => {
    it('should return true for matching plain text and hash', () => {
      const result = isValid(plainText, hashedText);
      expect(result).toBe(true);
    });

    it('should return false for non-matching plain text and hash', () => {
      const result = isValid('wrongpassword', hashedText);
      expect(result).toBe(false);
    });
  });
});
