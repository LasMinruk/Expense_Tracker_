import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

async function initDB() {
    // First connect to postgres database to check/create target database
    const rootPool = new Pool({
        ...dbConfig,
        database: 'postgres',
    });

    try {
        const rootClient = await rootPool.connect();
        const dbName = process.env.DB_NAME || 'expense_tracker';

        // Check if database exists
        const res = await rootClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [dbName]
        );

        if (res.rowCount === 0) {
            console.log(`Creating database ${dbName}...`);
            await rootClient.query(`CREATE DATABASE "${dbName}"`);
            console.log('✅ Database created');
        } else {
            console.log(`Database ${dbName} already exists`);
        }
        rootClient.release();
    } catch (err) {
        console.error('❌ Error checking/creating database:', err);
        // Continue anyway, maybe the user wants to connect to an existing DB
    } finally {
        await rootPool.end();
    }

    // Now connect to the target database
    const pool = new Pool({
        ...dbConfig,
        database: process.env.DB_NAME,
    });

    const client = await pool.connect();
    try {
        console.log('🏗️  Initializing database schema...');

        // Users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
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
      CREATE TABLE IF NOT EXISTS expenses (
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
      CREATE TABLE IF NOT EXISTS income (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Created income table');

        console.log('🎉 Database initialization completed successfully!');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

initDB();
