import { Status } from "src/enums/status.enum";
import { Game } from "src/game/entities/game.entity";
import { User } from "src/user/entities/user.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid'; 
@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'uuid', unique: true})
    qrIdentifier: string;

    @BeforeInsert()
    generateQrIdentifier() {
    if (!this.qrIdentifier) this.qrIdentifier = uuidv4();
    }

    @Column()
    qrCodeImage: string;

    @Column({type: 'enum', enum: Status, default: Status.W})
    status: string;
    
    @CreateDateColumn({ type: "timestamp"})
    createdAt: Date;

    @ManyToOne(()=>User, {nullable: false, cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;

    @ManyToOne(()=>Game, {nullable: false, cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn({ name: 'gameId', referencedColumnName: 'id' })
    game: Game;
}

