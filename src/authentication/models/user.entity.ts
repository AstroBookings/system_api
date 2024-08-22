import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Role } from "./role.type";

@Entity({ collection: 'users' })
export class User {
    @PrimaryKey()
    _id: string;

    @Property()
    id: string;

    @Property()
    name: string;
    @Property({unique: true})
    email: string;
    @Property({fieldName: 'password_hash'})
    passwordHash: string;

    @Property({type: 'text'})
    role: Role;
}



/* export type UserDocument = HydratedDocument<User>;
@Schema()
export class User {
    @Prop()
    id: string;
    @Prop()
    name: string;
    @Prop()
    email: string;
    @Prop()
    password_hash: string;
    @Prop()
    role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User); */


/* export const UserSchema = new mongoose.Schema({
    id: String,
  name: String,
  email: String,
  password_hash: String,
  role: String
});

export interface User extends mongoose.Document {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: Role;
}
 */
