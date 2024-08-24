import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserTokenPayload } from './models/user-token-payload.type';
import { UserToken } from './models/user-token.type';

/**
 * Authentication controller
 * @description Endpoints for registering and deleting users
 * @requires AuthenticationService for logic and database access
 */
@Controller('authentication')
export class AuthenticationController {
  readonly #logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {
    this.#logger.debug('🚀  initialized');
  }

  /**
   * Registers a new user.
   * @param registerDto - The data for registering a new user.
   * @returns A promise that resolves to a UserTokenDto containing the user's token and information.
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<UserToken> {
    this.#logger.log(`🤖 Registering user: ${registerDto.email}`);
    return this.authenticationService.register(registerDto);
  }

  /**
   * Logs in a user.
   * @param loginDto - The data for logging in a user.
   * @returns A promise that resolves to a UserTokenDto containing the user's token and information.
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto): Promise<UserToken> {
    this.#logger.log(`🤖 Logging in user: ${loginDto.email}`);
    return this.authenticationService.login(loginDto);
  }

  @Get('validate/:token')
  async validate(@Param('token') token: string): Promise<UserTokenPayload> {
    this.#logger.log(`🤖 Validating token: ${token}`);
    return this.authenticationService.validate(token);
  }
}
