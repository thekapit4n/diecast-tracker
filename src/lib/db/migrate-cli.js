// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in project root
const envPath = resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Now import other modules after env is loaded
import { runMigrations } from './migrate.js';

/**
 * CLI script to run database migrations only
 * Usage: node src/lib/db/migrate-cli.js
 */
async function migrate() {
	try {
		// Debug: Check if env vars are loaded
		const hasPostgresUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;
		if (!hasPostgresUrl) {
			console.error('❌ Environment variables not found!');
			console.error('Looking for: POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL');
			console.error('Current working directory:', process.cwd());
			console.error('Trying to load .env from:', resolve(__dirname, '../../../.env'));
			process.exit(1);
		}
		
		console.log('Running database migrations...');
		await runMigrations();
		console.log('✅ Migrations completed successfully!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Migration failed:', error);
		process.exit(1);
	}
}

migrate();

