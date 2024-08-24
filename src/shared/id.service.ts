import { Injectable } from '@nestjs/common';
import { Epoch, Snowyflake } from 'snowyflake';
/**
 * Service for generating unique IDs
 * @requires Snowyflake for ID generation
 */
@Injectable()
export class IdService {
  readonly snowyflake = new Snowyflake({
    workerId: 0n,
    processId: 1n,
    epoch: Epoch.Twitter,
  });
  /**
   * @description Generate a unique ID
   * @returns {string} - The unique ID
   */
  generateId(): string {
    return this.snowyflake.nextId().toString();
  }
}
