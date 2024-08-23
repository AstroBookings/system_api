import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';

/**
 * Authentication controller
 * @description Endpoints for registering and deleting users
 * @requires AuthenticationService for logic and database access
 */
@Controller('authentication')
export class AuthenticationController {
  readonly #logger = new Logger(AuthenticationController.name);
  constructor(private readonly authenticationService: AuthenticationService) {
    this.#logger.log('🚀  initialized');
  }

  /**
   * Registers a new user.
   * @param registerDto - The data for registering a new user.
   * @returns A promise that resolves to a UserTokenDto containing the user's token and information.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserTokenDto> {
    this.#logger.log(`🤖 Registering user: ${registerDto.email}`);
    return this.authenticationService.register(registerDto);
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

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   */
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    this.#logger.log(`🤖 Getting user: ${id}`);
    return this.authenticationService.getById(id);
  }
}
