import { User } from "src/user/entities/user.entity";
import { Game } from "src/game/entities/game.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class QueueEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "userId", referencedColumnName: "id" })
  user!: User;

  @ManyToOne(() => Game, { nullable: false, onDelete: "CASCADE" })
  @JoinColumn({ name: "gameId", referencedColumnName: "id" })
  game!: Game;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}