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
 * Compares a plain text with a hashed value.
 * @param text - The plain text to hash and compare.
 * @param hash - The hashed value to compare against.
 * @returns true if the text once hashed matches the hash, false otherwise.
 */
export function isValid(text: string, hash: string): boolean {
  const hashedText = hashText(text);
  return hashedText === hash;
}
