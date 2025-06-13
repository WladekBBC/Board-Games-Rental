import { User } from "src/user/entities/user.entity";
import { Column, Entity, IsNull, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    orderId: number;

    @Column()
    qrCodeData: string;

    @ManyToOne(()=>User, {nullable: false, cascade: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: User;
}