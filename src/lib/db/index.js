// Load environment variables if not already loaded (for CLI scripts)
import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Try to load .env file if running as a script (not in SvelteKit)
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
	try {
		dotenv.config();
	} catch (e) {
		// dotenv already loaded or .env not found, that's okay
	}
}

/**
 * Database connection using Supabase PostgreSQL
 * Uses POSTGRES_URL_NON_POOLING (preferred) or POSTGRES_URL from Supabase
 * Falls back to DATABASE_URL for backwards compatibility
 */
const connectionString =
	process.env.POSTGRES_URL_NON_POOLING ||
	process.env.POSTGRES_URL ||
	process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error(
		'Database connection string not found. Please set one of: POSTGRES_URL_NON_POOLING, POSTGRES_URL, or DATABASE_URL in your .env file.'
	);
}

// Create postgres client with connection pooling
// Supabase connection strings already include SSL configuration
const client = postgres(connectionString, {
	max: 1
});

export const db = drizzle(client, { schema });

