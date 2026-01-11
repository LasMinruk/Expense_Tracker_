import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { User } from "./User";

@Entity("income")
export class Income {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    amount!: number;

    @Column({ name: 'user_id' })
    userId!: number;

    @ManyToOne("User", (user: User) => user.income, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
