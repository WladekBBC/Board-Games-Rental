import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PermsDto } from "../dto/user.dto";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    permissions: PermsDto
}
