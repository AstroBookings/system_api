import { Controller, Delete, Get, Logger, Param } from '@nestjs/common';
import { User } from '../models/user.type';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Auxiliary controller for the authentication module.
 * @description Intended to be used only for testing purposes.
 * @warning Should be protected by an API key.
 */
@Controller('authentication/admin')
export class AdminController {
  readonly #logger = new Logger(AdminController.name);

  constructor(private readonly authenticationService: AuthenticationService) {
    this.#logger.debug('🚀  initialized');
  }

  @Get('test')
  async test() {
    return 'test';
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   */
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    this.#logger.log(`🤖 Getting user: ${id}`);
    return this.authenticationService.getById(id);
  }

  /**
   * Deletes a user by their email.
   * @param email - The email of the user to delete.
   * @returns A promise that resolves always to void.
   */
  @Delete(':email')
  async deleteUser(@Param('email') email: string): Promise<void> {
    this.#logger.log(`🤖 Deleting user: ${email}`);
    return this.authenticationService.deleteUserByEmail(email);
  }
}
