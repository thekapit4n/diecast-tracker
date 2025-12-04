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

