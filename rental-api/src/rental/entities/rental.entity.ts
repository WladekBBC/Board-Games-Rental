import { Game } from "src/game/entities/game.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rental {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    index: string;

    @Column()
    rentedAt: Date;

    @Column()
    returnedAt: Date;

    @OneToOne(type=>Game)
    @JoinColumn({ name: 'gameId' })
    game: Game;
}
