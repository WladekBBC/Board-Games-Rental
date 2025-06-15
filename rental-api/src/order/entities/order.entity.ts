import { Status } from "src/enums/status.enum";
import { Game } from "src/game/entities/game.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, IsNull, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid')
    qrCodeData: string;

    @Column({type: 'enum', enum: Status, default: Status.W})
    status: string;


    @ManyToOne(()=>User, {nullable: false, cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(()=>Game, {nullable: false, cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
    game: Game;
}