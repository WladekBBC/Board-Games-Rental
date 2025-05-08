import { Game } from "src/game/entities/game.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rental {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    index: string;

    @CreateDateColumn({ type: "timestamp"})
    rentedAt: Date;

    @Column({ nullable: true, type: 'timestamp' })
    returnedAt: Date | null;

    @ManyToOne(()=>Game, {nullable: false, cascade: false, eager: true})
    @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
    game: Game;
}
