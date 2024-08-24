import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
/**
 * Hash service is used to hash and compare passwords.
 * @requires crypto from 'crypto'
 */
@Injectable()
export class HashService {
  /**
   * Hash a password.
   * @param {string} text - The text to hash.
   * @returns {string} - The hashed text.
   */
  hashText(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
  /**
   * Compares a plain text with a hashed text.
   * @param text - The plain text.
   * @param hash - The hashed text.
   * @returns A promise that resolves to true if the texts match, false otherwise.
   */
  isValid(text: string, hash: string): boolean {
    const hashedText = this.hashText(text);
    return hashedText === hash;
  }
}
