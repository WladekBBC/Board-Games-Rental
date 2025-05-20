import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    title: string;

    @Column()
    description: string;

    @Column()
    category: string;

    @Column()
    imageUrl: string;

    @Column()
    amount: number;

    @Column()
    quantity: number;
}
