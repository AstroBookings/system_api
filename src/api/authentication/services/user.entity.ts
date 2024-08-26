import {
  Entity,
  PrimaryKey,
  Property,
  SerializedPrimaryKey,
} from '@mikro-orm/core';
import { Role } from '../models/role.type';

/**
 * User entity
 * @description Entity for read/write on users collection
 */
@Entity({ collection: 'users' })
export class UserEntity {
  /**
   * MongoDB Primary key
   * @description Do not use this _id, use the id instead
   */
  @PrimaryKey()
  _id: string;

  /**
   * Unique id for a user
   * @description This is the id that will be used in the JWT token
   */
  @SerializedPrimaryKey()
  id: string;

  @Property()
  name: string;

  @Property({ unique: true })
  email: string;

  @Property({ fieldName: 'password_hash' })
  passwordHash: string;

  @Property({ type: 'text' })
  role: Role;
}

/**
 * User entity data type
 * @description Without the MongoDB primary key
 */
export type UserEntityData = Omit<UserEntity, '_id'>;
