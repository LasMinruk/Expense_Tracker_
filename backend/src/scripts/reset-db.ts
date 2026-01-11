import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function resetDB() {
    const pool = new Pool(dbConfig);
    const client = await pool.connect();

    try {
        console.log('🗑️  Dropping existing tables...');
        await client.query(`DROP TABLE IF EXISTS income CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS expenses CASCADE;`);
        await client.query(`DROP TABLE IF EXISTS users CASCADE;`);
        console.log('✅ Tables dropped.');

        console.log('🏗️  Re-initializing database schema...');

        // Users table
        await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created users table');

        // Expenses table
        await client.query(`
            CREATE TABLE expenses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                cost DECIMAL(10, 2) NOT NULL,
                is_income BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created expenses table');

        // Income table
        await client.query(`
            CREATE TABLE income (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created income table');

        console.log('🎉 Database reset and initialization completed successfully!');
    } catch (err) {
        console.error('❌ Error resetting database:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

resetDB();
