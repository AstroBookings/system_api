import { Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
/**
 * Admin controller
 * @description Endpoints for setting up the database for testing purposes
 * @requires AdminService for database management
 * @warning Should be protected by an API key.
 */
@Controller('api/admin')
export class AdminController {
  readonly #logger = new Logger(AdminController.name);
  constructor(private readonly adminService: AdminService) {}

  /**
   * Regenerates the database
   * @returns Object with the operation status and message
   */
  @Post('regenerate-db')
  @HttpCode(200)
  async regenerateDatabase(): Promise<{ status: string; message: string }> {
    this.#logger.log('🧑‍🚀 Regenerating database');
    await this.adminService.clearDatabase();
    await this.adminService.createCollections();
    await this.adminService.seedDatabase();
    return { status: 'success', message: 'Database regenerated' };
  }

  @Post('clear')
  async clearDatabase() {
    this.#logger.log('🧑‍🚀 Clearing database');
    return this.adminService.clearDatabase();
  }

  @Post('create')
  async createCollections() {
    this.#logger.log('🧑‍🚀 Creating collections');
    return this.adminService.createCollections();
  }

  @Post('seed')
  async seedDatabase() {
    this.#logger.log('🧑‍🚀 Seeding database');
    return this.adminService.seedDatabase();
  }
}
