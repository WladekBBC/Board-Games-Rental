import { Perms } from "src/enums/permissions.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    permissions: Perms
}
