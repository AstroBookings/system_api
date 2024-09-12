import { User } from '@api/authentication/models/user.type';
import { AuthenticationService } from '@api/authentication/services/authentication.service';
import { Controller, Delete, Get, Logger, Param } from '@nestjs/common';

/**
 * Admin controller for the authentication module.
 * @description Intended to be used only for testing and administrative purposes.
 * @warning Should be protected by an API key or admin-only access.
 */
@Controller('api/authentication/admin')
export class AdminController {
  readonly #logger = new Logger(AdminController.name);

  constructor(private readonly authenticationService: AuthenticationService) {
    this.#logger.verbose('🚀  initialized');
  }

  @Get('ping')
  async test() {
    return 'pong';
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   */
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<User> {
    this.#logger.verbose(`🤖 Getting user: ${id}`);
    return this.authenticationService.getById(id);
  }

  /**
   * Deletes a user by their email.
   * @param email - The email of the user to delete.
   * @returns A promise that resolves always to void.
   */
  @Delete(':email')
  async deleteUser(@Param('email') email: string): Promise<void> {
    this.#logger.verbose(`🤖 Deleting user: ${email}`);
    return this.authenticationService.deleteUserByEmail(email);
  }
}
