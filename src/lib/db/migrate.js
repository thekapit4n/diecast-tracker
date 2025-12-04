import { db } from './index.js';
import { diecasts, brands } from './schema.js';
import { sql } from 'drizzle-orm';

/**
 * Run migrations to create tables
 * This should be run once to set up the database schema
 */
export async function runMigrations() {
	try {
		// Create enums
		await db.execute(sql`
			DO $$ BEGIN
				CREATE TYPE status AS ENUM ('pre-order', 'purchased', 'in-transit');
			EXCEPTION
				WHEN duplicate_object THEN null;
			END $$;
		`);

		await db.execute(sql`
			DO $$ BEGIN
				CREATE TYPE condition AS ENUM ('sealed', 'unboxed');
			EXCEPTION
				WHEN duplicate_object THEN null;
			END $$;
		`);

		// Create diecasts table
		await db.execute(sql`
			CREATE TABLE IF NOT EXISTS diecasts (
				id SERIAL PRIMARY KEY,
				brand VARCHAR(100) NOT NULL,
				model VARCHAR(200) NOT NULL,
				scale VARCHAR(20),
				color VARCHAR(50),
				status status NOT NULL DEFAULT 'purchased',
				condition condition NOT NULL DEFAULT 'sealed',
				image_url TEXT,
				notes TEXT,
				created_at TIMESTAMP DEFAULT NOW() NOT NULL,
				updated_at TIMESTAMP DEFAULT NOW() NOT NULL
			);
		`);

		// Create brands table
		await db.execute(sql`
			CREATE TABLE IF NOT EXISTS brands (
				id SERIAL PRIMARY KEY,
				name VARCHAR(100) NOT NULL UNIQUE,
				created_at TIMESTAMP DEFAULT NOW() NOT NULL
			);
		`);

		// Create index for faster searches
		await db.execute(sql`
			CREATE INDEX IF NOT EXISTS idx_diecasts_brand ON diecasts(brand);
			CREATE INDEX IF NOT EXISTS idx_diecasts_model ON diecasts(model);
			CREATE INDEX IF NOT EXISTS idx_diecasts_status ON diecasts(status);
		`);

		console.log('Migrations completed successfully');
	} catch (error) {
		console.error('Migration error:', error);
		throw error;
	}
}

