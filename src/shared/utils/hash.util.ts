import * as crypto from 'crypto';

/**
 * Hash a password.
 * @param {string} text - The text to hash.
 * @returns {string} - The hashed text.
 */
export function hashText(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

/**
 * Compares a plain text with a hashed text.
 * @param text - The plain text.
 * @param hash - The hashed text.
 * @returns true if the texts match, false otherwise.
 */
export function isValid(text: string, hash: string): boolean {
  const hashedText = hashText(text);
  return hashedText === hash;
}
