import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryColumn } from "typeorm";
import { Role } from "./role.type";

@Entity('users')
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({ name: "password_hash" })
    passwordHash: string;

    @Column({
        type: "enum",
        enum: ["traveler", "agency", "financial", "it"],
    })
    role: Role;
    
    @ObjectIdColumn({ name: "_id" })
    _id: ObjectId;
}
