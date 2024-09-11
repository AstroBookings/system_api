import { UserEntity } from '@api/authentication/services/user.entity';
import { MongoDriver } from '@mikro-orm/mongodb';

/*
 * Configuration for MongoDB Database
 */
export const MONGO_CONFIG = {
  driver: MongoDriver,
  clientUrl: 'mongodb://localhost:27017',
  dbName: 'SystemDB',
  entities: [UserEntity],
  debug: false,
};
