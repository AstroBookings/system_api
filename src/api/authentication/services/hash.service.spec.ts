import { hashText, isValid } from './hash.service';

describe('Hash Service', () => {
  const plainText = 'password123';
  const hashedText = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f';

  describe('hashText', () => {
    it('should hash the given text', () => {
      // Arrange: Prepare the input
      // Act: Call the hashText function
      const result = hashText(plainText);
      // Assert: Verify the output matches the expected hash
      expect(result).toBe(hashedText);
    });

    it('should produce different hashes for different inputs', () => {
      // Arrange: Prepare different inputs
      // Act: Hash both inputs
      const hash1 = hashText('password1');
      const hash2 = hashText('password2');
      // Assert: Ensure the hashes are not the same
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('isValid', () => {
    it('should return true for matching plain text and hash', () => {
      // Arrange: Prepare matching plain text and hash
      // Act: Call isValid function
      const result = isValid(plainText, hashedText);
      // Assert: Verify the result is true
      expect(result).toBe(true);
    });

    it('should return false for non-matching plain text and hash', () => {
      // Arrange: Prepare non-matching plain text
      // Act: Call isValid function
      const result = isValid('wrongpassword', hashedText);
      // Assert: Verify the result is false
      expect(result).toBe(false);
    });
  });
});
