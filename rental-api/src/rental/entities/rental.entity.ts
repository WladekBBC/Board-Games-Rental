import { Game } from "src/game/entities/game.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rental {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    index: string;

    @OneToOne(type=>Game)
    @JoinColumn({ name: 'gameId' })
    game: Game;
}
