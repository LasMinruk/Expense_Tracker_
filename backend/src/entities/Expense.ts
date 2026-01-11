import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import type { User } from "./User";

@Entity("expenses")
export class Expense {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column("decimal", { precision: 10, scale: 2 })
    cost!: number;

    @Column({ name: 'is_income', default: false })
    isIncome!: boolean;

    @Column({ name: 'user_id' })
    userId!: number;

    @ManyToOne("User", (user: User) => user.expenses, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user!: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}
