import { Game } from "src/game/entities/game.entity";
import { User } from "src/user/entities/user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class Rental {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  index!: string;

  @CreateDateColumn({ type: "timestamp" })
  rentedAt!: Date;

  @Column({ nullable: true, type: "timestamp" })
  returnedAt!: Date | null;

  @ManyToOne(() => Game, {
    nullable: false,
    cascade: true,
    eager: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "gameId", referencedColumnName: "id" })
  game!: Game;

  @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user!: User | null;
}
