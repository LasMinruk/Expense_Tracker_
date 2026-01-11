import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "@/entities/User";
import { Expense } from "@/entities/Expense";
import { Income } from "@/entities/Income";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true, // Auto-create tables for dev
    logging: false,
    entities: [User, Expense, Income],
    subscribers: [],
    migrations: [],
});

export const ensureDbConnected = async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    return AppDataSource;
};
