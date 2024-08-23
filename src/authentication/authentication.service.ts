import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Epoch, Snowyflake } from 'snowyflake';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';
import { User, UserEntity } from './models/user.entity';

/**
 * Authentication service
 * @description Logic and database access for authentication
 * @requires JwtService for JWT generation
 * @requires EntityRepository for database access
 */
@Injectable()
export class AuthenticationService {
  readonly logger = new Logger();
  readonly snowyflake = new Snowyflake({
    workerId: 1n,
    epoch: Epoch.Twitter,
  });

  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserTokenDto> {
    // Check if user with the same email already exists
    const existingUser = await this.userRepository.findOne({
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    // Create a new user entity from the DTO
    const id = this.snowyflake.nextId().toString();
    const passwordHash = this.#hash(registerDto.password);
    const userEntity: UserEntity = {
      id: id,
      name: registerDto.name,
      email: registerDto.email,
      passwordHash: passwordHash,
      role: registerDto.role,
    };
    // Insert the user entity into the database
    await this.userRepository.insert(userEntity);
    const user: UserDto = this.#mapToDto(userEntity);
    // Generate a token with the full user DTO
    const token = this.#generateToken(user);
    // Create and return the UserTokenDto
    return { user, token };
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found
   * @throws NotFoundException if the user is not found
   */
  async getById(id: string): Promise<UserDto | null> {
    const userEntity = await this.userRepository.findOne({ id: id });
    if (!userEntity) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // remove passwordHash from the user object
    const user = this.#mapToDto(userEntity);
    return user;
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to void in any case
   */
  async deleteUser(id: string): Promise<void> {
    // Find the user by ID
    const userEntity = await this.userRepository.findOne({ id: id });

    // If user not found, throw NotFoundException
    if (!userEntity) {
      return null;
    }
    // Delete the user
    await this.userRepository.nativeDelete(userEntity);
    this.logger.log(`User with ID ${id} has been deleted`);
  }

  #hash(source: string): string {
    return crypto.createHash('sha256').update(source).digest('hex');
  }

  #generateToken(user: UserDto): string {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  #mapToDto(user: UserEntity): UserDto {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
