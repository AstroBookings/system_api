import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
  constructor(private readonly authenticationService: AuthenticationService) {}

  /**
   * Registers a new user.
   * @param registerDto - The data for registering a new user.
   * @returns A promise that resolves to a UserTokenDto containing the user's token and information.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserTokenDto> {
    return this.authenticationService.register(registerDto);
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to void when the user is successfully deleted.
   */
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.authenticationService.deleteUser(id);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    console.log('geting user', id);
    return this.authenticationService.getById(id);
  }
}
