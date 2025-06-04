import { Column, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id:number;

    @Column({unique: true})
    title: string;

    @Column({length: 500})
    description: string;

    @Column()
    category: string;

    @Column()
    imageUrl: string;

    @Column()
    amount: number;

    @Column()
    quantity: number;

    @Column({ nullable: true })
    ages: string;

    @Column({ nullable: true })
    time: string;

    @Column({ nullable: true })
    players: string;
}
