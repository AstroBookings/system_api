import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IdService } from '@shared/id.service';
import { hashText, isValid } from '@shared/utils/hash.util';
import { LoginDto } from '../models/login.dto';
import { RegisterDto } from '../models/register.dto';
import { TokenPayload, UserToken } from '../models/user-token.type';
import { User } from '../models/user.type';
import { TokenService } from './token.service';
import { UserEntity, UserEntityData } from './user.entity';

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
    private readonly userRepository: EntityRepository<UserEntityData>,
    private readonly tokenService: TokenService,
    private readonly idService: IdService,
  ) {
    this.#logger.verbose('🚀  initialized');
  }

  async register(registerDto: RegisterDto): Promise<UserToken> {
    const existingUser = await this.userRepository.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      this.#logger.debug('👽 Email already in use', registerDto.email);
      throw new ConflictException('Email already in use');
    }
    const userEntityData: UserEntityData = {
      id: this.idService.generateId(),
      email: registerDto.email,
      passwordHash: hashText(registerDto.password),
      name: registerDto.name,
      role: registerDto.role,
    };
    await this.userRepository.insert(userEntityData);
    return this.#generateUserToken(userEntityData);
  }

  /**
   * Logs in a user.
   * @param loginDto - The data for logging in a user.
   * @returns A promise that resolves to a UserToken containing the user's token and information.
   * @throws UnauthorizedException if the credentials are invalid
   */
  async login(loginDto: LoginDto): Promise<UserToken> {
    const userEntity = await this.userRepository.findOne({
      email: loginDto.email,
    });
    if (!userEntity) {
      this.#logger.debug('👽 Invalid credentials email', loginDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!isValid(loginDto.password, userEntity.passwordHash)) {
      this.#logger.debug('👽 Invalid credentials password', loginDto.email);
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.#generateUserToken(userEntity);
  }

  /**
   * Validates a user token.
   * @param token - The token to validate.
   * @returns A promise that resolves to a UserToken object.
   */
  async validate(token: string): Promise<UserToken> {
    const tokenPayload: TokenPayload = this.tokenService.validateToken(token);
    const user = await this.getById(tokenPayload.sub);
    if (!user) {
      this.#logger.debug('👽 Invalid User for token', token);
      throw new UnauthorizedException('User not found');
    }
    return { user, token, exp: tokenPayload.exp };
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   * @throws NotFoundException if the user is not found
   */
  async getById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({ id: id });
    if (!userEntity) {
      this.#logger.debug('👽 User not found', id);
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
    const userEntity = await this.userRepository.findOne({ id: id });
    if (!userEntity) {
      this.#logger.debug(`👽 Not found user to delete with id: ${id}`);
      return;
    }
    await this.userRepository.nativeDelete(userEntity);
    this.#logger.verbose(`🤖 User with ID ${id} has been deleted`);
  }

  /**
   * Deletes a user by their email.
   * @param email - The email of the user to delete.
   * @returns A promise that resolves to void when the user is successfully deleted.
   */
  async deleteUserByEmail(email: string): Promise<void> {
    const userEntity = await this.userRepository.findOne({ email });
    if (!userEntity) {
      this.#logger.debug(`👽 Not found user to delete with email: ${email}`);
      return;
    }
    await this.userRepository.nativeDelete({ email });
    this.#logger.verbose(`🤖 User with email ${email} has been deleted`);
  }

  #mapToDto(user: UserEntityData): User {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  #generateUserToken(userEntity: UserEntityData): UserToken {
    const user: User = this.#mapToDto(userEntity);
    const token = this.tokenService.generateToken(userEntity.id);
    const exp = this.tokenService.decodeToken(token).exp;
    return { user, token, exp };
  }
}
