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
import { seedBrands } from './seed.js';

/**
 * Setup script to initialize database
 * Run this once after setting up your database connection
 */
async function setup() {
	try {
		console.log('Running migrations...');
		await runMigrations();
		console.log('Seeding brands...');
		await seedBrands();
		console.log('Database setup complete!');
		process.exit(0);
	} catch (error) {
		console.error('Setup failed:', error);
		process.exit(1);
	}
}

setup();

