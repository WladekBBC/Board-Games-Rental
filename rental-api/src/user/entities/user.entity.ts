import { Perms } from "src/enums/permissions.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ForeignKeyOptions } from "typeorm/decorator/options/ForeignKeyOptions";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({type: 'enum', enum: Perms, default: Perms.U})
    permissions: Perms
}
