import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { HashService } from '../shared/hash.service';
import { IdService } from '../shared/id.service';
import { TokenService } from '../shared/token.service';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';
import { User, UserEntity } from './models/user.entity';

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
  readonly _logger = new Logger(AuthenticationService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
    private readonly idService: IdService,
  ) {
    this._logger.log('🚀  initialized');
  }

  async register(registerDto: RegisterDto): Promise<UserTokenDto> {
    this._logger.log(`🤖 Registering user: ${registerDto.email}`);
    const existingUser = await this.userRepository.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const id = this.idService.generateId();
    const passwordHash = this.hashService.hashText(registerDto.password);
    const userEntity: UserEntity = {
      id: id,
      name: registerDto.name,
      email: registerDto.email,
      passwordHash: passwordHash,
      role: registerDto.role,
    };
    await this.userRepository.insert(userEntity);
    const user: UserDto = this.#mapToDto(userEntity);
    const token = this.tokenService.generateToken(user);
    const userTokenDto: UserTokenDto = { user, token };
    return userTokenDto;
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   * @throws NotFoundException if the user is not found
   */
  async getById(id: string): Promise<UserDto | null> {
    this._logger.log(`🤖 Retrieving user by ID: ${id}`);
    const userEntity = await this.userRepository.findOne({ id: id });
    if (!userEntity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const user = this.#mapToDto(userEntity);
    return user;
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to void in any case
   */
  async deleteById(id: string): Promise<void> {
    this._logger.log(`🤖 Deleting user by ID: ${id}`);
    const userEntity = await this.userRepository.findOne({ id: id });

    if (!userEntity) {
      this._logger.warn(`👽 Not found user to delete with id: ${id}`);
      return;
    }

    await this.userRepository.nativeDelete(userEntity);
    this._logger.log(`🤖 User with ID ${id} has been deleted`);
  }

  /**
   * Deletes a user by their email.
   * @param email - The email of the user to delete.
   * @returns A promise that resolves to void when the user is successfully deleted.
   */
  async deleteUserByEmail(email: string): Promise<void> {
    this._logger.log(`🤖 Deleting user by email: ${email}`);
    const userEntity = await this.userRepository.findOne({ email });

    if (!userEntity) {
      this._logger.warn(`👽 Not found user to delete with email: ${email}`);
      return;
    }

    await this.userRepository.nativeDelete({ email });
    this._logger.log(`🤖 User with email ${email} has been deleted`);
  }

  #mapToDto(user: UserEntity): UserDto {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
