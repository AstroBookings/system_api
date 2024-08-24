import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashService } from '../../shared/hash.service';
import { IdService } from '../../shared/id.service';
import { TokenService } from '../../shared/token.service';
import { LoginDto } from './models/login.dto';
import { RegisterDto } from './models/register.dto';
import { UserToken } from './models/user-token.type';
import { UserEntity, UserEntityData } from './models/user.entity';
import { User } from './models/user.type';
import { ValidToken } from './models/valid-token.type';

/**
 * Authentication service
 * @description Logic and database access for authentication
 * @requires EntityRepository for database access
 * @requires TokenService for JWT generation
 * @requires HashService for password hashing
 * @requires IdService for ID generation
 */
@Injectable()
export class AuthenticationService {
  readonly #logger = new Logger(AuthenticationService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
    private readonly idService: IdService,
  ) {
    this.#logger.debug('🚀  initialized');
  }

  async register(registerDto: RegisterDto): Promise<UserToken> {
    this.#logger.log(`🤖 Registering user: ${registerDto.email}`);
    const existingUser = await this.userRepository.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const userEntity: UserEntityData = {
      id: this.idService.generateId(),
      email: registerDto.email,
      passwordHash: this.hashService.hashText(registerDto.password),
      name: registerDto.name,
      role: registerDto.role,
    };
    await this.userRepository.insert(userEntity);
    return this.#generateUserTokenDto(userEntity);
  }

  /**
   * Logs in a user.
   * @param loginDto - The data for logging in a user.
   * @returns A promise that resolves to a UserTokenDto containing the user's token and information.
   * @throws UnauthorizedException if the credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<UserToken> {
    this.#logger.log(`🤖 Logging in user: ${loginDto.email}`);
    const userEntity = await this.userRepository.findOne({
      email: loginDto.email,
    });
    if (!userEntity) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!this.hashService.isValid(loginDto.password, userEntity.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.#generateUserTokenDto(userEntity);
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   * @throws NotFoundException if the user is not found
   */
  async getById(id: string): Promise<User | null> {
    this.#logger.log(`🤖 Retrieving user by ID: ${id}`);
    const userEntity = await this.userRepository.findOne({ id: id });
    if (!userEntity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.#mapToDto(userEntity);
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to void in any case
   */
  async deleteById(id: string): Promise<void> {
    this.#logger.log(`🤖 Deleting user by ID: ${id}`);
    const userEntity = await this.userRepository.findOne({ id: id });

    if (!userEntity) {
      this.#logger.warn(`👽 Not found user to delete with id: ${id}`);
      return;
    }

    await this.userRepository.nativeDelete(userEntity);
    this.#logger.log(`🤖 User with ID ${id} has been deleted`);
  }

  /**
   * Deletes a user by their email.
   * @param email - The email of the user to delete.
   * @returns A promise that resolves to void when the user is successfully deleted.
   */
  async deleteUserByEmail(email: string): Promise<void> {
    this.#logger.log(`🤖 Deleting user by email: ${email}`);
    const userEntity = await this.userRepository.findOne({ email });

    if (!userEntity) {
      this.#logger.warn(`👽 Not found user to delete with email: ${email}`);
      return;
    }

    await this.userRepository.nativeDelete({ email });
    this.#logger.log(`🤖 User with email ${email} has been deleted`);
  }

  /**
   * Validates a user token.
   * @param token - The token to validate.
   * @returns A promise that resolves to a ValidToken object.
   */
  async validate(token: string): Promise<ValidToken> {
    const user = this.tokenService.validateToken(token);
    const expiresAt = this.tokenService.getExpirationDate(token);
    return { user, token, expiresAt };
  }

  #mapToDto(user: UserEntityData): User {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  #generateUserTokenDto(userEntity: UserEntityData): UserToken {
    const user: User = this.#mapToDto(userEntity);
    const token = this.tokenService.generateToken(user);
    return { user, token };
  }
}
