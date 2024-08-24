import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Role } from './role.type';

/**
 * User entity
 * @description Entity for read/write on users collection
 */
@Entity({ collection: 'users' })
export class UserEntity {
  /**
   * MongoDB Primary key
   */
  @PrimaryKey()
  _id: string;

  /**
   * Unique id for a user, to be used as a reference
   */
  @Property()
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
