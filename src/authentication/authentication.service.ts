import {
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as crypto from 'crypto';

import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Epoch, Snowyflake } from 'snowyflake';
import { RegisterDto } from './models/register.dto';
import { UserTokenDto } from './models/user-token.dto';
import { UserDto } from './models/user.dto';
import { User } from './models/user.entity';

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger();
  private snowyflake = new Snowyflake({
    workerId: 1n,
    epoch: Epoch.Twitter,
  });

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<UserTokenDto> {
    try {
      // console.log('🤖 entering register', registerDto);
      // Check if user with the same email already exists
      const existingUser = await this.userRepository.findOne({
        email: registerDto.email,
      });
      if (existingUser) {
        this.logger.error('Email already in use');
        throw new ConflictException('Email already in use');
      }
      // Create a new user entity from the DTO
      const passwordHash = this.#hash(registerDto.password);
      const newLocal = {
        id: this.snowyflake.nextId().toString(),
        name: registerDto.name,
        email: registerDto.email,
        passwordHash: passwordHash,
        role: registerDto.role,
      };
      

      await this.userRepository.insert(newLocal);
      const user: UserDto = {
        id: newLocal.id,
        name: newLocal.name,
        email: newLocal.email,
        role: newLocal.role,
      };

      // Generate a token with the full user DTO
      const token = this.#generateToken(user);
      // Create and return the UserTokenDto
      return {
        user,
        token,
      };
    } catch (error) {
      console.log('👽 error', error);
    }
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns A promise that resolves to the UserDto if found, or null if not found.
   */
  async getById(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findOne({ id: id });

    if (!user) {
      console.log('👽 user not found', id);
      return null;
    }
    console.log('👽 user found', user);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Deletes a user by their ID.
   * @param id - The ID of the user to delete.
   * @returns A promise that resolves to void when the user is successfully deleted.
   */
  async deleteUser(id: string): Promise<void> {
    console.log('🤖 entering deleting user', id);
    // Find the user by ID
    const user = await this.userRepository.findOne({ id: id });

    // If user not found, throw NotFoundException
    if (!user) {
      console.log('👽 user not found', id);
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    console.log('🤖 deleting user', id);
    // Delete the user
    await this.userRepository.nativeDelete(user);
    console.log('🤖 user deleted', id);
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
}
