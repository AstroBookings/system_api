import { Epoch, Snowyflake } from 'snowyflake';
/**
 * Service for generating unique IDs
 * @requires Snowyflake for ID generation
 */
export class IdService {
  readonly snowyflake = new Snowyflake({
    workerId: 1n,
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
